import type { Handle } from "@sveltejs/kit"
import { extractLocaleFromRequest } from "$lib/paraglide/runtime"
import * as paraglideAdapter from "$lib/paraglide/adapter"
import { sequence } from "@sveltejs/kit/hooks"

// The beta adapter doesn't replace %paraglide.lang% in app.html; do it here.
const langInjector: Handle = async ({ event, resolve }) => {
	const locale = extractLocaleFromRequest(event.request)
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale)
	})
}

export const handle: Handle = sequence(paraglideAdapter.handle, langInjector)
