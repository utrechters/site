import { WHATSAPP_LINK } from "$app/env/private"

export function privateLinks(): Record<string, string> {
	return {
		whatsapp: WHATSAPP_LINK
	}
}
