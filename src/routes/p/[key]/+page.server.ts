import { error } from "@sveltejs/kit"
import { env } from "$env/dynamic/public"
import { privateLinks } from "$lib/server/private"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = ({ params }) => {
	if (!(params.key in privateLinks())) error(404)
	return { key: params.key, siteKey: env.PUBLIC_TURNSTILE_SITE_KEY ?? "" }
}
