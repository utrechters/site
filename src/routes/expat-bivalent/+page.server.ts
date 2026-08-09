import type { PageServerLoad } from "./$types"

// Must stay in sync with ITEM_REGISTRY keys in game.svelte.ts
// (can't import .svelte.ts in server context)
const VALID_CODES = new Set(["CH", "HU", "NL", "RO"])

export const load: PageServerLoad = ({ url }) => {
	const rawA = url.searchParams.get("a")
	const rawB = url.searchParams.get("b")
	const rawScore = url.searchParams.get("score")

	// No params → normal game mode, no error
	if (rawA === null && rawB === null && rawScore === null) {
		return { shared: null, shareError: false }
	}

	const a = rawA?.toUpperCase() ?? ""
	const b = rawB?.toUpperCase() ?? ""
	const scoreNum = Number(rawScore)

	const valid =
		VALID_CODES.has(a) &&
		VALID_CODES.has(b) &&
		a !== b &&
		rawScore !== null &&
		Number.isInteger(scoreNum) &&
		scoreNum >= 0 &&
		scoreNum <= 100

	if (!valid) {
		return { shared: null, shareError: true }
	}

	return {
		shared: { a, b, pctA: scoreNum, pctB: 100 - scoreNum },
		shareError: false
	}
}
