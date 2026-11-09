import { error } from "@sveltejs/kit"
import { PUBLIC_TURNSTILE_SITE_KEY } from "$app/env/public"
import { privateLinks } from "#lib/server/private.ts"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = ({ params }) => {
	if (!(params.key in privateLinks())) error(404)
	return { key: params.key, siteKey: PUBLIC_TURNSTILE_SITE_KEY }
}
