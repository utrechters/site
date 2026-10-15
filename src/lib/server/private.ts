import { env } from "$env/dynamic/private"

export function privateLinks(): Record<string, string> {
	return {
		whatsapp: env.WHATSAPP_LINK ?? ""
	}
}
