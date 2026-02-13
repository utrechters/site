<script lang="ts">
	let {
		img,
		alt,
		text,
		url,
		date
	}: {
		img: string
		alt: string
		text: string
		url: string
		date: Date | null | undefined
	} = $props()

	const day = $derived(date ? date.toLocaleDateString("en-GB", { day: "numeric" }) : null)
	const month = $derived(
		date ? date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase() : null
	)
	const weekday = $derived(date ? date.toLocaleDateString("en-GB", { weekday: "long" }) : null)
</script>

<a
	href={url}
	target="_blank"
	rel="noreferrer"
	class="group flex flex-col overflow-hidden rounded-lg border border-warm bg-white shadow-sm transition-shadow hover:shadow-md"
>
	<div class="flex flex-1 items-center gap-3 p-4">
		<img src={img} {alt} class="h-10 w-10 shrink-0 rounded object-contain" />
		<div class="min-w-0">
			<p class="text-sm font-semibold text-text">{text}</p>
			<p class="text-xs text-text-muted">
				{#if day && month && weekday}
					{weekday}, {day} {month}
				{:else}
					&nbsp;
				{/if}
			</p>
		</div>
	</div>
	<div
		class="border-t border-warm bg-accent-light px-4 py-2 text-center text-xs font-medium text-accent transition-colors group-hover:bg-accent group-hover:text-white"
	>
		{#if date}
			Join on Meetup &rarr;
		{:else}
			Browse all &rarr;
		{/if}
	</div>
</a>
