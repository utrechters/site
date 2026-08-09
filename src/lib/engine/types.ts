export type Category = "food" | "place" | "icon" | "transport" | "trait" | "economics" | "misc"

export type Item = {
	id: string
	category: Category
	intensity: 1 | 2 | 3
}

export type Side = {
	item: Item
	countryCode: string
}

export type Round = {
	a: Side
	b: Side
	isWildcard: boolean
}

export type Profile = {
	pctA: number
	pctB: number
}

export type Phase = "setup" | "playing" | "result"
