import type { Category, Item, Round, Profile } from "./types"

export const ROUND_COUNT = 15
export const WILDCARD_INTERVAL = 5 // one wildcard every N rounds (1-indexed position)

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
	const a = [...arr]
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

export function groupByCategory(items: Item[]): Partial<Record<Category, Item[]>> {
	const groups: Partial<Record<Category, Item[]>> = {}
	for (const item of items) {
		;(groups[item.category] ??= []).push(item)
	}
	return groups
}

export function buildRoundQueue(
	codeA: string,
	itemsA: Item[],
	codeB: string,
	itemsB: Item[],
	rng: () => number = Math.random
): Round[] {
	if (codeA === codeB) throw new Error(`Country codes must differ (got "${codeA}" twice)`)
	if (!itemsA.length) throw new Error(`No items for country "${codeA}"`)
	if (!itemsB.length) throw new Error(`No items for country "${codeB}"`)

	const groupA = groupByCategory(itemsA)
	const groupB = groupByCategory(itemsB)

	// --- same-category pool ---
	const sameCatPool: Round[] = []
	const categories = new Set<Category>([
		...(Object.keys(groupA) as Category[]),
		...(Object.keys(groupB) as Category[])
	])
	for (const cat of categories) {
		const as = groupA[cat] ?? []
		const bs = groupB[cat] ?? []
		if (!as.length || !bs.length) continue
		const sa = shuffle(as, rng)
		const sb = shuffle(bs, rng)
		const n = Math.min(sa.length, sb.length)
		for (let i = 0; i < n; i++) {
			sameCatPool.push({
				a: { item: sa[i], countryCode: codeA },
				b: { item: sb[i], countryCode: codeB },
				isWildcard: false
			})
		}
	}

	// --- wildcard pool: intensity-3 pairs from DIFFERENT categories ---
	const highA = shuffle(
		itemsA.filter((i) => i.intensity === 3),
		rng
	)
	const highB = shuffle(
		itemsB.filter((i) => i.intensity === 3),
		rng
	)
	const wildcardPool: Round[] = []
	for (const a of highA) {
		for (const b of highB) {
			if (a.category !== b.category) {
				wildcardPool.push({
					a: { item: a, countryCode: codeA },
					b: { item: b, countryCode: codeB },
					isWildcard: true
				})
			}
		}
	}

	const desiredWildcards = Math.floor(ROUND_COUNT / WILDCARD_INTERVAL)
	const pickedWildcards = shuffle(wildcardPool, rng).slice(0, desiredWildcards)
	const neededSameCat = ROUND_COUNT - pickedWildcards.length

	if (sameCatPool.length < neededSameCat) {
		throw new Error(
			`Not enough same-category pairs to fill ${ROUND_COUNT} rounds: ` +
				`need ${neededSameCat}, have ${sameCatPool.length}. ` +
				`Add more items to "${codeA}" or "${codeB}".`
		)
	}

	const selectedSameCat = shuffle(sameCatPool, rng).slice(0, neededSameCat)

	// Weave wildcards in at every WILDCARD_INTERVAL-th position (1-indexed)
	const rounds: Round[] = []
	let si = 0
	let wi = 0
	for (let i = 0; i < ROUND_COUNT; i++) {
		if ((i + 1) % WILDCARD_INTERVAL === 0 && wi < pickedWildcards.length) {
			rounds.push(pickedWildcards[wi++])
		} else {
			rounds.push(selectedSameCat[si++])
		}
	}

	return rounds
}

export function computeProfile(votesA: number, votesB: number): Profile {
	const total = votesA + votesB
	if (total === 0) throw new Error("Cannot compute profile: no votes recorded")
	const pctA = Math.round((votesA / total) * 100)
	return { pctA, pctB: 100 - pctA }
}
