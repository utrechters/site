import { describe, it, expect } from "vitest"
import {
	buildRoundQueue,
	computeProfile,
	groupByCategory,
	shuffle,
	ROUND_COUNT,
	WILDCARD_INTERVAL
} from "./pure"
import type { Item } from "./types"

// ── fixtures (mirrors actual seed data) ─────────────────────────────────────

const CH: Item[] = [
	{ id: "ch-fondue", category: "food", intensity: 1 },
	{ id: "ch-raclette", category: "food", intensity: 2 },
	{ id: "ch-chocolate", category: "food", intensity: 1 },
	{ id: "ch-alps", category: "place", intensity: 2 },
	{ id: "ch-matterhorn", category: "place", intensity: 3 },
	{ id: "ch-swiss-army-knife", category: "icon", intensity: 1 },
	{ id: "ch-watchmaking", category: "icon", intensity: 3 },
	{ id: "ch-neutrality", category: "icon", intensity: 3 },
	{ id: "ch-trains-on-time", category: "transport", intensity: 2 },
	{ id: "ch-cable-car", category: "transport", intensity: 1 },
	{ id: "ch-punctual", category: "trait", intensity: 3 },
	{ id: "ch-multilingual", category: "trait", intensity: 2 },
	{ id: "ch-reserved", category: "trait", intensity: 2 },
	{ id: "ch-banking", category: "economics", intensity: 3 },
	{ id: "ch-expensive", category: "economics", intensity: 2 }
]

const NL: Item[] = [
	{ id: "nl-stroopwafel", category: "food", intensity: 1 },
	{ id: "nl-hagelslag", category: "food", intensity: 1 },
	{ id: "nl-herring", category: "food", intensity: 2 },
	{ id: "nl-drop", category: "food", intensity: 2 },
	{ id: "nl-amsterdam-canals", category: "place", intensity: 2 },
	{ id: "nl-tulip-fields", category: "place", intensity: 1 },
	{ id: "nl-cycling", category: "icon", intensity: 3 },
	{ id: "nl-windmills", category: "icon", intensity: 1 },
	{ id: "nl-orange-fever", category: "icon", intensity: 2 },
	{ id: "nl-ns-trains", category: "transport", intensity: 2 },
	{ id: "nl-directness", category: "trait", intensity: 3 },
	{ id: "nl-tall", category: "trait", intensity: 1 },
	{ id: "nl-gezelligheid", category: "trait", intensity: 3 },
	{ id: "nl-polder-model", category: "economics", intensity: 3 },
	{ id: "nl-port-rotterdam", category: "economics", intensity: 2 }
]

// ── shuffle ──────────────────────────────────────────────────────────────────

describe("shuffle", () => {
	it("preserves all elements", () => {
		const ids = CH.map((i) => i.id)
		const result = shuffle(CH, () => 0.5).map((i) => i.id)
		expect(result.sort()).toEqual(ids.sort())
	})

	it("does not mutate the original array", () => {
		const original = [...CH]
		shuffle(CH, Math.random)
		expect(CH).toEqual(original)
	})
})

// ── groupByCategory ──────────────────────────────────────────────────────────

describe("groupByCategory", () => {
	it("groups items by their category", () => {
		const g = groupByCategory(CH)
		expect(g.food?.length).toBe(3)
		expect(g.icon?.length).toBe(3)
		expect(g.transport?.length).toBe(2)
		expect(g.place?.length).toBe(2)
	})

	it("returns an empty object for an empty array", () => {
		expect(groupByCategory([])).toEqual({})
	})
})

// ── buildRoundQueue ──────────────────────────────────────────────────────────

describe("buildRoundQueue", () => {
	const rounds = () => buildRoundQueue("CH", CH, "NL", NL)

	it(`produces exactly ${ROUND_COUNT} rounds`, () => {
		expect(rounds().length).toBe(ROUND_COUNT)
	})

	it("never pairs items from the same country", () => {
		for (const r of rounds()) {
			expect(r.a.countryCode).not.toBe(r.b.countryCode)
		}
	})

	it("non-wildcard pairs always share a category", () => {
		for (const r of rounds()) {
			if (!r.isWildcard) {
				expect(r.a.item.category).toBe(r.b.item.category)
			}
		}
	})

	it("wildcard pairs always come from different categories", () => {
		for (const r of rounds()) {
			if (r.isWildcard) {
				expect(r.a.item.category).not.toBe(r.b.item.category)
			}
		}
	})

	it(`wildcards land at every ${WILDCARD_INTERVAL}th position (1-indexed)`, () => {
		const rs = rounds()
		for (let i = 0; i < rs.length; i++) {
			if ((i + 1) % WILDCARD_INTERVAL === 0) {
				expect(rs[i].isWildcard, `round ${i + 1} should be a wildcard`).toBe(true)
			}
		}
	})

	it("wildcards contain only intensity-3 items", () => {
		for (const r of rounds()) {
			if (r.isWildcard) {
				expect(r.a.item.intensity).toBe(3)
				expect(r.b.item.intensity).toBe(3)
			}
		}
	})

	it("is deterministic with a fixed RNG", () => {
		const seeded = () => 0.42
		const r1 = buildRoundQueue("CH", CH, "NL", NL, seeded)
		const r2 = buildRoundQueue("CH", CH, "NL", NL, seeded)
		expect(r1.map((r) => r.a.item.id + "|" + r.b.item.id)).toEqual(
			r2.map((r) => r.a.item.id + "|" + r.b.item.id)
		)
	})

	it("throws clearly when country codes are identical", () => {
		expect(() => buildRoundQueue("CH", CH, "CH", CH)).toThrow(/must differ/i)
	})

	it("throws clearly when one item array is empty", () => {
		expect(() => buildRoundQueue("CH", [], "NL", NL)).toThrow(/No items for country "CH"/i)
		expect(() => buildRoundQueue("CH", CH, "NL", [])).toThrow(/No items for country "NL"/i)
	})

	it("throws clearly when there are not enough same-category pairs", () => {
		// Only 1 same-cat pair, no wildcards (intensity 1 only) → can never fill ROUND_COUNT rounds
		const tinyA: Item[] = [{ id: "xx-apple", category: "food", intensity: 1 }]
		const tinyB: Item[] = [{ id: "yy-bread", category: "food", intensity: 1 }]
		expect(() => buildRoundQueue("XX", tinyA, "YY", tinyB)).toThrow(
			/Not enough same-category pairs/
		)
	})

	it("gracefully handles zero wildcards when no intensity-3 items exist", () => {
		// All intensity-1: no wildcards possible. Falls back to all same-cat pairs.
		// We need ROUND_COUNT same-cat pairs: build a big enough set.
		const bigA: Item[] = Array.from({ length: 20 }, (_, i) => ({
			id: `aa-item${i}`,
			category: i % 2 === 0 ? "food" : "place",
			intensity: 1
		}))
		const bigB: Item[] = Array.from({ length: 20 }, (_, i) => ({
			id: `bb-item${i}`,
			category: i % 2 === 0 ? "food" : "place",
			intensity: 1
		}))
		const rs = buildRoundQueue("AA", bigA, "BB", bigB)
		expect(rs.length).toBe(ROUND_COUNT)
		expect(rs.every((r) => !r.isWildcard)).toBe(true)
	})
})

// ── computeProfile ───────────────────────────────────────────────────────────

describe("computeProfile", () => {
	it("pctA + pctB === 100 for all vote splits across a full game", () => {
		for (let a = 0; a <= ROUND_COUNT; a++) {
			const b = ROUND_COUNT - a
			if (a + b === 0) continue
			const { pctA, pctB } = computeProfile(a, b)
			expect(pctA + pctB).toBe(100)
		}
	})

	it("all votes to A → 100 / 0", () => {
		expect(computeProfile(15, 0)).toEqual({ pctA: 100, pctB: 0 })
	})

	it("all votes to B → 0 / 100", () => {
		expect(computeProfile(0, 15)).toEqual({ pctA: 0, pctB: 100 })
	})

	it("even split → 50 / 50", () => {
		expect(computeProfile(7, 7)).toEqual({ pctA: 50, pctB: 50 })
		expect(computeProfile(1, 1)).toEqual({ pctA: 50, pctB: 50 })
	})

	it("throws a clear error when no votes have been recorded", () => {
		expect(() => computeProfile(0, 0)).toThrow(/no votes recorded/i)
	})

	it("pctB is always exactly 100 - pctA (no double-rounding)", () => {
		// Spot-check an awkward split: 10 out of 15 → 66.66… → Math.round = 67; pctB must be 33
		const { pctA, pctB } = computeProfile(10, 5)
		expect(pctA).toBe(67)
		expect(pctB).toBe(33)
		expect(pctA + pctB).toBe(100)
	})
})
