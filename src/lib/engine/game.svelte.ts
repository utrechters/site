import type { Round, Profile, Phase, Item } from "./types"
import { buildRoundQueue, computeProfile } from "./pure"

import chRaw from "$lib/data/items/ch.json"
import huRaw from "$lib/data/items/hu.json"
import roRaw from "$lib/data/items/ro.json"
import nlRaw from "$lib/data/items/nl.json"

const ITEM_REGISTRY: Record<string, Item[]> = {
	ch: chRaw as Item[],
	hu: huRaw as Item[],
	ro: roRaw as Item[],
	nl: nlRaw as Item[]
}

// Codes that have item data — used by the UI to filter the country picker
export const SUPPORTED_CODES = new Set(Object.keys(ITEM_REGISTRY))

class GameState {
	countryA = $state<string | null>(null)
	countryB = $state<string | null>(null)
	rounds = $state<Round[]>([])
	currentIndex = $state(0)
	votesA = $state(0)
	votesB = $state(0)
	phase = $state<Phase>("setup")

	currentRound = $derived(this.rounds[this.currentIndex] ?? null)
	progress = $derived({ current: this.currentIndex + 1, total: this.rounds.length })
	profile = $derived<Profile | null>(
		this.phase === "result" && this.votesA + this.votesB > 0
			? computeProfile(this.votesA, this.votesB)
			: null
	)

	start(codeA: string, codeB: string) {
		const key = (c: string) => c.toLowerCase()
		const itemsA = ITEM_REGISTRY[key(codeA)]
		const itemsB = ITEM_REGISTRY[key(codeB)]
		if (!itemsA) throw new Error(`No item data for country: ${codeA}`)
		if (!itemsB) throw new Error(`No item data for country: ${codeB}`)

		this.rounds = buildRoundQueue(codeA, itemsA, codeB, itemsB)
		this.countryA = codeA
		this.countryB = codeB
		this.currentIndex = 0
		this.votesA = 0
		this.votesB = 0
		this.phase = "playing"
	}

	pick(side: "a" | "b") {
		if (this.phase !== "playing") return
		if (side === "a") this.votesA++
		else this.votesB++

		if (this.currentIndex >= this.rounds.length - 1) {
			this.phase = "result"
		} else {
			this.currentIndex++
		}
	}

	reset() {
		this.countryA = null
		this.countryB = null
		this.rounds = []
		this.currentIndex = 0
		this.votesA = 0
		this.votesB = 0
		this.phase = "setup"
	}
}

export const game = new GameState()
