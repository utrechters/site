<script lang="ts">
	import "../app.css"
	import Header from "../components/organisms/header.svelte"
	import { onMount } from "svelte"

	let { children } = $props()

	let scrolled = $state(false)

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 100
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	})

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}
</script>

<main class="flex w-full flex-col items-center">
	<Header hideNavigation={scrolled} />
	<div class="flex w-full flex-col">
		{@render children()}
	</div>

	{#if scrolled}
		<button
			onclick={scrollToTop}
			class="fixed right-4 bottom-4 h-9 w-9 rounded-full border border-warm bg-white text-text-muted shadow-sm transition-colors hover:text-text"
			aria-label="Scroll to top"
		>
			&uarr;
		</button>
	{/if}
</main>
