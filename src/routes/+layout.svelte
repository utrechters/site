<script lang="ts">
	import "../app.css"
	import Header from "../components/organisms/header.svelte"
	import { onMount } from "svelte"

	let { children } = $props()

	let scrolled = $state(false)

	onMount(() => {
		const handleScroll = () => {
			const y = window.scrollY
			if (y > 80) scrolled = true
			else if (y < 20) scrolled = false
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	})

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}
</script>

<Header hideNavigation={scrolled} />
<main class="flex w-full flex-col items-center">
	<div class="flex w-full flex-col">
		{@render children()}
	</div>
</main>
{#if scrolled}
	<button
		onclick={scrollToTop}
		class="border-warm text-text-muted hover:text-text fixed right-4 bottom-4 h-9 w-9 rounded-full border bg-white shadow-sm transition-colors"
		aria-label="Scroll to top"
	>
		&uarr;
	</button>
{/if}
