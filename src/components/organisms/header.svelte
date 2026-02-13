<script lang="ts">
	import Navigation from "../molecules/navigation.svelte"

	let { hideNavigation }: { hideNavigation: boolean } = $props()
</script>

{#if hideNavigation}
	<header class="fixed top-0 z-50 flex w-full bg-white/90 px-6 py-3 shadow-sm backdrop-blur-sm">
		<Navigation />
	</header>
{/if}
