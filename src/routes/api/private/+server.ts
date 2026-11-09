import { error, json } from "@sveltejs/kit"
import { dev } from "$app/env"
import { TURNSTILE_SECRET } from "$app/env/private"
import { privateLinks } from "#lib/server/private.ts"
import type { RequestHandler } from "./$types"

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export const POST: RequestHandler = async ({ request, url, getClientAddress, fetch }) => {
	const { token } = await request.json().catch(() => ({}))
	if (typeof token !== "string" || !TURNSTILE_SECRET) error(403)

	const response = await fetch(SITEVERIFY, {
		method: "POST",
		body: new URLSearchParams({
			secret: TURNSTILE_SECRET,
			response: token,
			remoteip: getClientAddress()
		})
	})
	const result: { success: boolean; hostname?: string } = await response.json()
	if (!result.success || (!dev && result.hostname !== url.hostname)) error(403)

	return json(privateLinks(), { headers: { "Cache-Control": "no-store" } })
}
