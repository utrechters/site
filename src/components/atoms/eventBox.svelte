<script lang="ts">
	let {
		img,
		alt,
		text,
		url,
		date,
		dark = false
	}: {
		img: string
		alt: string
		text: string
		url: string
		date: Date | null | undefined
		dark?: boolean
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
	class={[
		"group flex flex-col overflow-hidden rounded-xl shadow-sm",
		"motion-safe:transition motion-safe:duration-200 motion-safe:ease-out",
		dark
			? "border border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-lg"
			: "border border-warm bg-white hover:shadow-md"
	].join(" ")}
>
	<div class={["flex flex-1 items-center gap-4", dark ? "py-8 px-5" : "p-4"].join(" ")}>
		<img
			src={img}
			{alt}
			class={["shrink-0 rounded-lg object-contain", dark ? "h-20 w-20" : "h-10 w-10"].join(" ")}
		/>
		<div class="min-w-0">
			<p class={["font-semibold", dark ? "text-lg text-white" : "text-sm text-text"].join(" ")}>
				{text}
			</p>
			<p class={["text-xs", dark ? "text-white/50" : "text-text-muted"].join(" ")}>
				{#if day && month && weekday}
					{weekday}, {day} {month}
				{:else}
					&nbsp;
				{/if}
			</p>
		</div>
	</div>
	<div
		class={[
			`border-t px-4 ${dark ? "py-3" : "py-2"} text-center text-xs font-extrabold`,
			"motion-safe:transition motion-safe:duration-150",
			dark
				? "border-white/10 bg-white/5 text-accent group-hover:bg-accent group-hover:text-white"
				: "border-warm bg-accent-light text-accent group-hover:bg-accent group-hover:text-white"
		].join(" ")}
	>
		{#if date}
			Join on Meetup &rarr;
		{:else}
			Browse all &rarr;
		{/if}
	</div>
</a>
