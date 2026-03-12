<script lang="ts">
	import Navigation from "../molecules/navigation.svelte"
	import AltNav from "../molecules/altNav.svelte"

	let { hideNavigation }: { hideNavigation: boolean } = $props()
</script>

<header
	class="fixed top-0 z-50 flex w-full px-6 py-3 {hideNavigation ? 'sm:bg-white sm:shadow-sm' : ''}"
>
	{#if hideNavigation}
		<div class="hidden w-full sm:flex">
			<Navigation />
		</div>
	{/if}
	<AltNav class={hideNavigation ? "sm:hidden" : ""} />
</header>
