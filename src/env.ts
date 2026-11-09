import { defineEnvVars } from "@sveltejs/kit/env"

const optional = (value: string | undefined) => value ?? ""

export const variables = defineEnvVars({
	WHATSAPP_LINK: { schema: optional },
	TURNSTILE_SECRET: { schema: optional },
	PUBLIC_TURNSTILE_SITE_KEY: { public: true, schema: optional }
})
