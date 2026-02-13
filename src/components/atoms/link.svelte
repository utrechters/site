<script lang="ts">
	// @ts-nocheck
	export let ref: string;
	export let children;
</script>

<a href={ref} target="_blank" referrerpolicy="no-referrer"> {@render children?.()} </a>
