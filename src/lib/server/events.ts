import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

const EVENT_API = import.meta.env.VITE_EVENT_API || "http://localhost:3001"
const ICON_DIR = join(tmpdir(), "utrechters-icons")

export type RemoteEvent = {
	title: string
	link: string
	date: string
	icon: string
}

export async function fetchEvents(fetch: typeof globalThis.fetch): Promise<RemoteEvent[]> {
	const response = await fetch(`${EVENT_API}/events`)
	if (!response.ok) {
		throw new Error(`Event API returned ${response.status}`)
	}
	return response.json()
}

export function iconId(url: string): string {
	return createHash("sha256").update(url).digest("hex").slice(0, 32)
}

export type CachedIcon = { body: Buffer; type: string }

export async function readIcon(id: string): Promise<CachedIcon | null> {
	try {
		const [body, type] = await Promise.all([
			readFile(join(ICON_DIR, id)),
			readFile(join(ICON_DIR, `${id}.type`), "utf8")
		])
		return { body, type }
	} catch {
		return null
	}
}

export async function downloadIcon(id: string, url: string): Promise<CachedIcon | null> {
	const response = await globalThis.fetch(url, { referrerPolicy: "no-referrer" })
	const type = response.headers.get("content-type") ?? ""
	if (!response.ok || !type.startsWith("image/")) return null

	const body = Buffer.from(await response.arrayBuffer())
	await mkdir(ICON_DIR, { recursive: true })
	await Promise.all([
		writeFile(join(ICON_DIR, id), body),
		writeFile(join(ICON_DIR, `${id}.type`), type)
	])
	return { body, type }
}
