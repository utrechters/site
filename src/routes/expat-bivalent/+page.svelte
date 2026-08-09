<script lang="ts">
	import { untrack } from "svelte"
	import { replaceState } from "$app/navigation"
	import { game, SUPPORTED_CODES } from "$lib/engine/game.svelte"
	import { countries } from "$lib/data"
	import Footer from "../../components/organisms/footer.svelte"
	import * as m from "$lib/paraglide/messages.js"
	import { getLocale } from "$lib/paraglide/runtime.js"

	// English item strings (always loaded as fallback)
	import chEn from "$lib/data/i18n/en/ch.json"
	import huEn from "$lib/data/i18n/en/hu.json"
	import roEn from "$lib/data/i18n/en/ro.json"
	import nlEn from "$lib/data/i18n/en/nl.json"
	// Dutch item strings
	import chNl from "$lib/data/i18n/nl/ch.json"
	import huNl from "$lib/data/i18n/nl/hu.json"
	import roNl from "$lib/data/i18n/nl/ro.json"
	import nlNl from "$lib/data/i18n/nl/nl.json"
	// Hungarian item strings
	import chHu from "$lib/data/i18n/hu/ch.json"
	import huHu from "$lib/data/i18n/hu/hu.json"
	import roHu from "$lib/data/i18n/hu/ro.json"
	import nlHu from "$lib/data/i18n/hu/nl.json"

	type Bundle = Record<string, string>
	type LangBundle = Record<string, Bundle>

	const ITEM_I18N: Record<string, LangBundle> = {
		en: { ch: chEn as Bundle, hu: huEn as Bundle, ro: roEn as Bundle, nl: nlEn as Bundle },
		nl: { ch: chNl as Bundle, hu: huNl as Bundle, ro: roNl as Bundle, nl: nlNl as Bundle },
		hu: { ch: chHu as Bundle, hu: huHu as Bundle, ro: roHu as Bundle, nl: nlHu as Bundle }
	}

	// Returns the item label in the current language, falling back to English
	function itemLabel(id: string): string {
		const lang = getLocale()
		const prefix = id.slice(0, 2)
		return ITEM_I18N[lang]?.[prefix]?.[id] ?? ITEM_I18N.en?.[prefix]?.[id] ?? id
	}

	const available = countries.filter((c) => SUPPORTED_CODES.has(c.code.toLowerCase()))
	const byCode = Object.fromEntries(countries.map((c) => [c.code, c]))

	// Server-validated URL params (null = no params, object = valid share link)
	let { data } = $props()

	// Shape of a shareable/displayable result
	type Result = { a: string; b: string; pctA: number; pctB: number; total?: number }

	// Snapshot set from URL params on load, or captured when the game finishes.
	// untrack: intentionally captures the load-time value only; updates come via $effect.
	let resultSnapshot = $state<Result | null>(untrack(() => data.shared ?? null))

	// Unified result for display — prefers snapshot, but also covers the instant
	// the game finishes (before the $effect runs) to avoid a frame flash.
	const currentResult = $derived<Result | null>(
		resultSnapshot ??
			(game.phase === "result" && game.profile && game.countryA && game.countryB
				? {
						a: game.countryA,
						b: game.countryB,
						pctA: game.profile.pctA,
						pctB: game.profile.pctB,
						total: game.progress.total
					}
				: null)
	)

	let picks = $state<string[]>([])
	let copied = $state(false)

	function toggle(code: string) {
		if (picks.includes(code)) {
			picks = picks.filter((p) => p !== code)
		} else if (picks.length < 2) {
			picks = [...picks, code]
		}
	}

	function start() {
		if (picks.length !== 2) return
		game.start(picks[0], picks[1])
	}

	function reset() {
		game.reset()
		picks = []
		resultSnapshot = null
		replaceState("/expat-bivalent", {})
	}

	// When the game finishes: capture result into snapshot and encode in URL
	$effect(() => {
		if (game.phase === "result" && game.profile && game.countryA && game.countryB) {
			resultSnapshot = {
				a: game.countryA,
				b: game.countryB,
				pctA: game.profile.pctA,
				pctB: game.profile.pctB,
				total: game.progress.total
			}
			replaceState(
				`?${new URLSearchParams({ a: game.countryA, b: game.countryB, score: String(game.profile.pctA) })}`,
				{}
			)
		}
	})

	async function share() {
		if (!currentResult) return
		const url = window.location.href
		const cA = byCode[currentResult.a]
		const cB = byCode[currentResult.b]
		const title = m.og_shared_title({
			pctA: currentResult.pctA,
			nameA: cA?.name ?? currentResult.a,
			pctB: currentResult.pctB,
			nameB: cB?.name ?? currentResult.b
		})

		if ("share" in navigator) {
			try {
				await navigator.share({ title, url })
				return
			} catch {
				// cancelled or browser unsupported — fall through to clipboard
			}
		}
		try {
			await navigator.clipboard.writeText(url)
			copied = true
			setTimeout(() => (copied = false), 2000)
		} catch {
			window.prompt(m.share_prompt_label(), url)
		}
	}
</script>

<svelte:head>
	{#if currentResult}
		{@const cA = byCode[currentResult.a]}
		{@const cB = byCode[currentResult.b]}
		{@const nameA = cA?.name ?? currentResult.a}
		{@const nameB = cB?.name ?? currentResult.b}
		<title
			>{m.meta_shared_title({
				pctA: currentResult.pctA,
				nameA,
				pctB: currentResult.pctB,
				nameB
			})}</title
		>
		<meta
			name="description"
			content={m.meta_shared_description({
				pctA: currentResult.pctA,
				nameA,
				pctB: currentResult.pctB,
				nameB
			})}
		/>
		<meta
			property="og:title"
			content={m.og_shared_title({
				pctA: currentResult.pctA,
				nameA,
				pctB: currentResult.pctB,
				nameB
			})}
		/>
		<meta property="og:description" content={m.og_shared_description()} />
		<!-- TODO: generate a dynamic OG image showing the result card split -->
		<meta property="og:image" content="https://utrechters.net/utrechters.png" />
		<meta
			property="og:url"
			content="https://utrechters.net/expat-bivalent?a={currentResult.a}&b={currentResult.b}&score={currentResult.pctA}"
		/>
	{:else}
		<title>{m.meta_game_title()}</title>
		<meta name="description" content={m.meta_game_description()} />
		<meta property="og:title" content={m.og_game_title()} />
		<meta property="og:description" content={m.og_game_description()} />
		<meta property="og:image" content="https://utrechters.net/utrechters.png" />
		<meta property="og:url" content="https://utrechters.net/expat-bivalent" />
	{/if}
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<!-- ── INVALID SHARE LINK ────────────────────────────────────────────────── -->
{#if data.shareError}
	<section class="bg-cream min-h-screen px-4 pt-24 pb-16">
		<div class="mx-auto max-w-sm">
			<p class="text-accent mb-3 text-center text-xs font-medium tracking-widest uppercase">
				{m.game_label()}
			</p>
			<h1 class="text-text mb-6 text-center text-2xl font-bold">{m.error_h1()}</h1>
			<div class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
				<p class="text-text/80 mb-6 leading-relaxed">{m.error_body()}</p>
				<a
					href="/expat-bivalent"
					class="bg-accent block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90 motion-safe:transition"
				>
					{m.error_cta()}
				</a>
			</div>
		</div>
	</section>

	<!-- ── RESULT CARD (rehydrated from URL or freshly played) ───────────────── -->
{:else if currentResult !== null}
	{@const res = currentResult}
	{@const cA = byCode[res.a]}
	{@const cB = byCode[res.b]}

	<section class="bg-cream min-h-screen px-4 pt-24 pb-4">
		<div class="mx-auto max-w-sm">
			<p class="text-accent mb-3 text-center text-xs font-medium tracking-widest uppercase">
				{m.result_eyebrow()}
			</p>
			<h1 class="text-text mb-2 text-center text-2xl font-bold">{m.result_h1()}</h1>
			<p class="text-text-muted mb-8 text-center text-sm">
				{res.total ? m.result_subtitle_played({ total: res.total }) : m.result_subtitle_shared()}
			</p>

			<div class="mb-4 rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
				<!-- Country A bar -->
				<div class="mb-5">
					<div class="mb-2 flex items-center gap-3">
						<span class="text-3xl leading-none" aria-hidden="true">{cA?.flag ?? "🌍"}</span>
						<span class="text-text min-w-0 flex-1 font-semibold">{cA?.name ?? res.a}</span>
						<span class="text-text text-xl font-bold">{res.pctA}%</span>
					</div>
					<div
						class="bg-warm h-2.5 w-full overflow-hidden rounded-full"
						role="meter"
						aria-valuenow={res.pctA}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="{cA?.name ?? res.a} {res.pctA}%"
					>
						<div
							class="bg-accent h-full rounded-full motion-safe:transition-all motion-safe:delay-100 motion-safe:duration-700"
							style:width="{res.pctA}%"
						></div>
					</div>
				</div>

				<!-- Country B bar -->
				<div>
					<div class="mb-2 flex items-center gap-3">
						<span class="text-3xl leading-none" aria-hidden="true">{cB?.flag ?? "🌍"}</span>
						<span class="text-text min-w-0 flex-1 font-semibold">{cB?.name ?? res.b}</span>
						<span class="text-text text-xl font-bold">{res.pctB}%</span>
					</div>
					<div
						class="bg-warm h-2.5 w-full overflow-hidden rounded-full"
						role="meter"
						aria-valuenow={res.pctB}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="{cB?.name ?? res.b} {res.pctB}%"
					>
						<div
							class="bg-highlight h-full rounded-full motion-safe:transition-all motion-safe:delay-200 motion-safe:duration-700"
							style:width="{res.pctB}%"
						></div>
					</div>
				</div>

				<p
					class="text-text/70 mt-5 border-t border-black/10 pt-4 text-center text-sm leading-relaxed"
				>
					{#if res.pctA > res.pctB}
						{m.result_more_a({ nameA: cA?.name ?? res.a, nameB: cB?.name ?? res.b })}
					{:else if res.pctB > res.pctA}
						{m.result_more_b({ nameA: cA?.name ?? res.a, nameB: cB?.name ?? res.b })}
					{:else}
						{m.result_tie()}
					{/if}
				</p>
			</div>

			<!-- Share -->
			<button
				onclick={share}
				aria-live="polite"
				class="bg-accent mb-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white hover:opacity-90 motion-safe:transition"
			>
				{copied ? m.result_copied() : m.result_share()}
			</button>

			<!-- Play again -->
			<button
				onclick={reset}
				class="text-text-muted ring-warm hover:text-text w-full rounded-xl px-4 py-3 text-sm font-medium ring-1 hover:ring-black/20 motion-safe:transition"
			>
				{m.result_play_again()}
			</button>
		</div>
	</section>

	<Footer />

	<!-- ── PLAYING ────────────────────────────────────────────────────────────── -->
{:else if game.phase === "playing"}
	{#if game.currentRound !== null}
		{@const round = game.currentRound}
		{@const cA = byCode[round.a.countryCode]}
		{@const cB = byCode[round.b.countryCode]}
		{@const labelA = itemLabel(round.a.item.id)}
		{@const labelB = itemLabel(round.b.item.id)}

		<div class="bg-surface flex min-h-screen flex-col pt-14">
			<!-- Visually-hidden h1 for screen readers / axe page-has-heading-one -->
			<h1 class="sr-only">{m.game_label()}</h1>

			<!-- Progress strip (white/50 for WCAG contrast on dark bg) -->
			<div class="flex items-center justify-between px-4 py-2.5">
				<span class="text-xs text-white/50">
					{game.progress.current} / {game.progress.total}
				</span>
				{#if round.isWildcard}
					<span class="text-accent text-xs font-semibold tracking-wide uppercase">
						{m.round_wildcard()}
					</span>
				{:else}
					<span class="text-xs text-white/50 capitalize">{round.a.item.category}</span>
				{/if}
			</div>

			<!-- Thin progress bar -->
			<div
				class="h-0.5 w-full bg-white/10"
				role="progressbar"
				aria-valuenow={game.progress.current}
				aria-valuemin={1}
				aria-valuemax={game.progress.total}
				aria-label={m.round_progress_label()}
			>
				<div
					class="bg-accent h-full motion-safe:transition-all motion-safe:duration-300"
					style:width="{(game.progress.current / game.progress.total) * 100}%"
				></div>
			</div>

			<!-- Choice A -->
			<button
				onclick={() => game.pick("a")}
				aria-label={m.round_choice_label({
					item: labelA,
					country: cA?.name ?? round.a.countryCode
				})}
				class="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-white
               hover:bg-white/5 focus-visible:bg-white/5 focus-visible:ring-2
               focus-visible:ring-white/40 focus-visible:outline-none focus-visible:ring-inset
               motion-safe:transition motion-safe:duration-150"
			>
				<span class="text-6xl leading-none" aria-hidden="true">{cA?.flag ?? "🌍"}</span>
				<span class="max-w-60 text-center text-xl font-semibold">{labelA}</span>
				<span class="text-sm text-white/50">{cA?.name ?? round.a.countryCode}</span>
			</button>

			<!-- "or" divider -->
			<div class="flex items-center gap-4 px-6" aria-hidden="true">
				<div class="h-px flex-1 bg-white/10"></div>
				<span class="text-xs tracking-widest text-white/30 uppercase">{m.round_or()}</span>
				<div class="h-px flex-1 bg-white/10"></div>
			</div>

			<!-- Choice B -->
			<button
				onclick={() => game.pick("b")}
				aria-label={m.round_choice_label({
					item: labelB,
					country: cB?.name ?? round.b.countryCode
				})}
				class="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-white
               hover:bg-white/5 focus-visible:bg-white/5 focus-visible:ring-2
               focus-visible:ring-white/40 focus-visible:outline-none focus-visible:ring-inset
               motion-safe:transition motion-safe:duration-150"
			>
				<span class="text-6xl leading-none" aria-hidden="true">{cB?.flag ?? "🌍"}</span>
				<span class="max-w-60 text-center text-xl font-semibold">{labelB}</span>
				<span class="text-sm text-white/50">{cB?.name ?? round.b.countryCode}</span>
			</button>
		</div>
	{/if}

	<!-- ── SETUP ──────────────────────────────────────────────────────────────── -->
{:else}
	<section class="bg-cream min-h-screen px-4 pt-24 pb-16">
		<div class="mx-auto max-w-sm">
			<p class="text-accent mb-3 text-center text-xs font-medium tracking-widest uppercase">
				{m.game_label()}
			</p>
			<h1 class="text-text mb-2 text-center text-2xl font-bold">{m.setup_h1()}</h1>
			<p class="text-text-muted mb-10 text-center text-sm leading-relaxed">
				{m.setup_subtitle()}
			</p>

			<div class="mb-6 flex flex-col gap-3" role="group" aria-label={m.setup_h1()}>
				{#each available as c (c.code)}
					{@const selected = picks.includes(c.code)}
					{@const faded = picks.length === 2 && !selected}
					<button
						onclick={() => toggle(c.code)}
						aria-pressed={selected}
						class={[
							"flex w-full items-center gap-4 rounded-xl p-4 text-left ring-1",
							"motion-safe:transition motion-safe:duration-150",
							selected
								? "bg-accent-light ring-accent ring-2"
								: faded
									? "bg-white opacity-40 ring-black/5"
									: "bg-white ring-black/5 hover:shadow-md motion-safe:hover:-translate-y-0.5"
						].join(" ")}
					>
						<span class="text-4xl leading-none" aria-hidden="true">{c.flag}</span>
						<div class="min-w-0 flex-1">
							<p class="text-text font-semibold">{c.name}</p>
							<p class="text-text-muted text-xs">{c.region}</p>
						</div>
						{#if selected}
							<span class="text-accent text-sm font-bold" aria-hidden="true">✓</span>
						{/if}
					</button>
				{/each}
			</div>

			<button
				onclick={start}
				disabled={picks.length !== 2}
				aria-disabled={picks.length !== 2}
				class={[
					"w-full rounded-xl px-4 py-3 text-sm font-semibold motion-safe:transition",
					picks.length === 2
						? "bg-accent text-white hover:opacity-90"
						: "bg-warm text-text-muted cursor-not-allowed"
				].join(" ")}
			>
				{picks.length === 2
					? m.setup_btn_ready({
							flagA: byCode[picks[0]]?.flag ?? "",
							flagB: byCode[picks[1]]?.flag ?? ""
						})
					: m.setup_btn_idle()}
			</button>
		</div>
	</section>
{/if}
