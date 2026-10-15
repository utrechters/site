<script lang="ts">
	import type { PageProps } from "./$types"

	let { data }: PageProps = $props()

	const STORAGE_KEY = "utrechters-private"
	let widget = $state<HTMLDivElement>()
	let value = $state("")
	let failed = $state(false)

	function readCache(): Record<string, string> | null {
		try {
			return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null")
		} catch {
			return null
		}
	}

	function writeCache(links: Record<string, string>) {
		try {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(links))
		} catch {
			return
		}
	}

	function open(links: Record<string, string>) {
		const link = links[data.key]
		if (!link) {
			failed = true
		} else if (/^https?:\/\//.test(link)) {
			location.replace(link)
		} else {
			value = link
		}
	}

	async function unlock(token: string) {
		const response = await fetch("/api/private", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token })
		})
		if (!response.ok) {
			failed = true
			return
		}
		const links = await response.json()
		writeCache(links)
		open(links)
	}

	$effect(() => {
		const cached = readCache()
		if (cached) return open(cached)

		const script = document.createElement("script")
		script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
		script.onload = () =>
			window.turnstile.render(widget!, {
				sitekey: data.siteKey,
				callback: unlock,
				"error-callback": () => (failed = true)
			})
		document.head.append(script)
	})
</script>

<svelte:head>
	<title>Utrechters</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="bg-cream text-text flex min-h-screen flex-col items-center justify-center gap-6 px-4">
	{#if value}
		<a href="tel:{value}" class="text-accent text-xl font-semibold">{value}</a>
	{:else if failed}
		<p class="text-text-muted">Something went wrong. Please reload the page and try again.</p>
	{:else}
		<p class="text-text-muted">Checking your browser...</p>
		<div bind:this={widget}></div>
	{/if}
	<p class="text-text-muted text-sm">
		By joining, you approve all <a href="/#rules" class="text-accent underline">community rules</a>.
	</p>
	<noscript>
		<p class="text-text-muted">This page needs JavaScript to verify you are not a bot.</p>
	</noscript>
</main>
