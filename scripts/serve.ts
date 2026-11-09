import { createServer } from "node:http"
import { readdir, readFile, stat } from "node:fs/promises"
import { extname, join, resolve } from "node:path"
import { getRequest, setResponse } from "@sveltejs/kit/node"

const port = Number(process.env.PORT ?? 4173)
const publish = resolve("build")
const functionsDir = resolve(".netlify/v1/functions")

const functions = (await readdir(functionsDir)).filter((f) => f.endsWith(".mjs"))
if (functions.length !== 1) {
	throw new Error(`expected one function in ${functionsDir}, found ${functions.length}`)
}
const { default: handler } = await import(join(functionsDir, functions[0]))

const types: Record<string, string> = {
	".css": "text/css",
	".ico": "image/x-icon",
	".js": "text/javascript",
	".json": "application/json",
	".png": "image/png",
	".svg": "image/svg+xml",
	".txt": "text/plain",
	".webmanifest": "application/manifest+json",
	".xml": "application/xml"
}

async function staticFile(pathname: string): Promise<string | null> {
	const file = join(publish, decodeURIComponent(pathname))
	if (!file.startsWith(publish + "/")) return null
	try {
		return (await stat(file)).isFile() ? file : null
	} catch {
		return null
	}
}

createServer(async (req, res) => {
	const base = `http://localhost:${port}`
	const file = await staticFile(new URL(req.url ?? "/", base).pathname)
	if (file) {
		res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" })
		res.end(await readFile(file))
		return
	}
	const request = await getRequest({ request: req, base })
	await setResponse(res, await handler(request, { ip: "127.0.0.1" }))
}).listen(port, () => console.log(`netlify output on :${port}`))
