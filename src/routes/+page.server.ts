import { fetchEvents, iconId } from "$lib/server/events"
import type { PageServerLoad } from "./$types"

export type EventLink = {
	title: string
	link: string
	date: Date
	icon: string
}

export const load: PageServerLoad = async ({ fetch }) => {
	const data = await fetchEvents(fetch)

	return {
		events: data.map(
			(e): EventLink => ({ ...e, date: new Date(e.date), icon: `/icons/${iconId(e.icon)}` })
		)
	}
}
