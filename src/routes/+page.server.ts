import type { PageServerLoad } from "./$types"

const EVENT_API = import.meta.env.VITE_EVENT_API || "http://localhost:3001"

export type View = {
	links: EventLinks
}

export type EventLink = {
	link: string
	date: Date | null
}

export type EventLinks = {
	Tuesday: EventLink
	Friday: EventLink
}

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${EVENT_API}/events`)
	if (!response.ok) {
		throw new Error(`Event API returned ${response.status}`)
	}
	const data = await response.json()

	return {
		links: {
			Tuesday: {
				link: data.Tuesday.link,
				date: data.Tuesday.date ? new Date(data.Tuesday.date) : null
			},
			Friday: { link: data.Friday.link, date: data.Friday.date ? new Date(data.Friday.date) : null }
		}
	}
}
