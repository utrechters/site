<script lang="ts">
	import Navigation from "../molecules/navigation.svelte"
	import AltNav from "../molecules/altNav.svelte"

	let { hideNavigation }: { hideNavigation: boolean } = $props()
</script>

<header class="fixed top-0 z-50 flex w-full px-6 py-3 {hideNavigation ? 'bg-white shadow-sm' : ''}">
	{#if hideNavigation}
		<Navigation />
	{:else}
		<AltNav />
	{/if}
</header>
