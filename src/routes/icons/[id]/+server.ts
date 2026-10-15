import { error } from "@sveltejs/kit"
import { downloadIcon, fetchEvents, iconId, readIcon } from "$lib/server/events"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async ({ params, fetch }) => {
	if (!/^[0-9a-f]{32}$/.test(params.id)) error(404)

	let icon = await readIcon(params.id)
	if (!icon) {
		const events = await fetchEvents(fetch)
		const url = events.find((e) => iconId(e.icon) === params.id)?.icon
		if (!url) error(404)
		icon = await downloadIcon(params.id, url)
		if (!icon) error(502)
	}

	return new Response(new Uint8Array(icon.body), {
		headers: {
			"Content-Type": icon.type,
			"Cache-Control": "public, max-age=604800, immutable"
		}
	})
}
