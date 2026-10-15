import { error, json } from "@sveltejs/kit"
import { dev } from "$app/environment"
import { env } from "$env/dynamic/private"
import { privateLinks } from "$lib/server/private"
import type { RequestHandler } from "./$types"

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export const POST: RequestHandler = async ({ request, url, getClientAddress, fetch }) => {
	const { token } = await request.json().catch(() => ({}))
	if (typeof token !== "string" || !env.TURNSTILE_SECRET) error(403)

	const response = await fetch(SITEVERIFY, {
		method: "POST",
		body: new URLSearchParams({
			secret: env.TURNSTILE_SECRET,
			response: token,
			remoteip: getClientAddress()
		})
	})
	const result: { success: boolean; hostname?: string } = await response.json()
	if (!result.success || (!dev && result.hostname !== url.hostname)) error(403)

	return json(privateLinks(), { headers: { "Cache-Control": "no-store" } })
}
