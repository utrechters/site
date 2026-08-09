import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { paraglideSveltekit } from "@inlang/paraglide-sveltekit"

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		paraglideSveltekit({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide",
			strategy: ["url", "cookie", "baseLocale"]
		})
	]
})
