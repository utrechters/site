<script lang="ts">
	import { browser } from "$app/environment"
	import { inView } from "$lib/inView"

	import EventBox from "../components/atoms/eventBox.svelte"
	import Footer from "../components/organisms/footer.svelte"

	let { data } = $props()
	const links = $derived(data.links)

	// Svelte 5 state (runes)
	let aboutIn = $state(false)
	let rulesIn = $state(false)
	let contactIn = $state(false)

	// Helper: classes for "reveal"
	const revealBase = "motion-safe:transition motion-safe:duration-500 motion-safe:ease-out"
</script>

<svelte:head>
	<title>Utrechters — Utrecht's expat meetup community</title>
	<meta
		name="description"
		content="Utrechters is a volunteer-run meetup group for locals and expats in Utrecht. We meet every Tuesday and first Friday for drinks, fun, and new friendships."
	/>
	<link rel="canonical" href="https://utrechters.net" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://utrechters.net" />
	<meta property="og:title" content="Utrechters — Utrecht's expat meetup community" />
	<meta
		property="og:description"
		content="Volunteer-run meetup group for locals and expats in Utrecht, since 2008."
	/>
	<meta property="og:image" content="https://utrechters.net/utrechters.png" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section
	class="hero-spotlight relative flex min-h-screen flex-col items-center justify-center overflow-clip px-4 pt-16 pb-24"
>
	<div class={`${revealBase} flex translate-y-0 flex-col items-center text-center opacity-100`}>
		<img
			src="/utrechters.png"
			alt="Utrechters logo"
			class="mb-6 h-48 w-48 rounded-full object-cover shadow-lg ring-4 ring-white/10"
		/>
		<h1 class="mb-1 text-2xl font-bold tracking-tight text-white">Welcome!</h1>
		<p class="text-sm text-white/50">
			We are the <span class="font-semibold text-white/80">UTRECHTERS</span>.
		</p>
	</div>

	<div class="mt-20 flex w-full max-w-2xl flex-col items-center gap-4">
		<p class="text-accent text-xs font-medium tracking-widest uppercase">Upcoming Events</p>

		<div class="grid w-full grid-cols-1 gap-10 p-2 sm:grid-cols-2 sm:gap-4">
			<div class="card-spotlight">
				<EventBox
					text="First Friday's drinks"
					date={links.Friday.date}
					img="/meetup.png"
					alt="Meetup Logo"
					url={links.Friday.link}
					dark
				/>
			</div>
			<div class="card-spotlight">
				<EventBox
					text="Mingle Mania"
					date={links.Tuesday.date}
					img="/drinks.png"
					alt="Meetup Logo"
					url={links.Tuesday.link}
					dark
				/>
			</div>
		</div>
	</div>

	<a
		href="https://www.meetup.com/utrechters/events/"
		target="_blank"
		rel="noreferrer"
		class="absolute bottom-8 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 motion-safe:transition"
	>
		<img src="/miffy.png" alt="" class="h-4 w-4 rounded object-contain opacity-60" />
		Browse all events &rarr;
	</a>
</section>

<section id="about" class="bg-surface px-4 py-20">
	<div class="mx-auto max-w-xl" use:inView={{ onEnter: () => (aboutIn = true) }}>
		<div
			class={revealBase}
			class:opacity-0={browser && !aboutIn}
			class:translate-y-2={browser && !aboutIn}
			class:opacity-100={!browser || aboutIn}
			class:translate-y-0={!browser || aboutIn}
		>
			<h2 class="mb-6 text-2xl font-bold text-white">About Us</h2>
			<p class="mb-4 leading-relaxed text-white/70">
				A community of locals and expats, operated on a voluntary basis.
			</p>
			<p class="leading-relaxed text-white/70">
				Utrechters meetup group (founded in 2008 and previously known as Make The Most Of Utrecht
				Meetup) aims to meet new people, have a good time and make new friends, all while enjoying
				the good life in Utrecht. And that could be anything, because there is always something nice
				going on in Utrecht!
			</p>
		</div>
	</div>
</section>

<section id="rules" class="bg-warm px-4 py-20">
	<div class="mx-auto max-w-xl" use:inView={{ onEnter: () => (rulesIn = true) }}>
		<div
			class={revealBase}
			class:opacity-0={browser && !rulesIn}
			class:translate-y-2={browser && !rulesIn}
			class:opacity-100={!browser || rulesIn}
			class:translate-y-0={!browser || rulesIn}
		>
			<p class="text-accent mb-3 text-xs font-medium tracking-widest uppercase">Community</p>
			<h2 class="text-text mb-6 text-2xl font-bold">Guidelines</h2>

			<div class="bg-cream/60 space-y-6 rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
				<p class="text-text/80 leading-relaxed">
					This community exists to help <span class="text-text font-semibold">you</span> to connect,
					to feel welcome, and to meet people from the Utrecht area, what practically means:
					<br />
					<span class="text-text font-semibold">People from all around the globe.</span>
					<br />
					It takes courage to join a group, especially one full of strangers. We are here to back you
					up.
				</p>

				<p class="text-text/80 leading-relaxed">
					To keep this space healthy and enjoyable for everyone, we follow a few simple principles:
				</p>

				<ul class="space-y-4">
					<li
						class="rounded-xl bg-white/60 p-4 ring-1 ring-black/5
						       motion-safe:transition motion-safe:duration-200 motion-safe:ease-out
						       motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
					>
						<p class="text-text font-semibold">Be respectful. Always.</p>
						<p class="text-text/70 mt-1 text-sm leading-relaxed">
							Different backgrounds, cultures, and personalities meet here. Treat others with basic
							human decency.
						</p>
					</li>

					<li
						class="rounded-xl bg-white/60 p-4 ring-1 ring-black/5
						       motion-safe:transition motion-safe:duration-200 motion-safe:ease-out
						       motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
					>
						<p class="text-text font-semibold">It's okay to be human.</p>
						<p class="text-text/70 mt-1 text-sm leading-relaxed">
							Many of our events involve drinks. Things can come out wrong. That happens. A simple
							apology goes a long way, and it's free, no Tikkie link attached.
						</p>
					</li>

					<li
						class="rounded-xl bg-white/60 p-4 ring-1 ring-black/5
						       motion-safe:transition motion-safe:duration-200 motion-safe:ease-out
						       motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
					>
						<p class="text-text font-semibold">We document serious incidents.</p>
						<p class="text-text/70 mt-1 text-sm leading-relaxed">
							If something happens ("drama") — at an event or on WhatsApp — we may document it
							privately. This is never shared publicly. It simply ensures clarity if stories differ
							later. We value fairness and transparency.
						</p>
					</li>

					<li
						class="rounded-xl bg-white/60 p-4 ring-1 ring-black/5
						       motion-safe:transition motion-safe:duration-200 motion-safe:ease-out
						       motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
					>
						<p class="text-text font-semibold">Acknowledge courage.</p>
						<p class="text-text/70 mt-1 text-sm leading-relaxed">
							Joining a new group is not easy. If someone is new, help them feel included. This is
							your single best way to contribute.
						</p>
					</li>
				</ul>

				<div class="border-t border-black/10 pt-5">
					<p class="text-text/80 leading-relaxed">
						We're not here to build a brand. We're here to build bridges.
					</p>
					<p class="text-text mt-3 font-medium">
						Let's make this a place you're proud to be part of.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="contact" class="bg-cream px-4 py-20">
	<div class="mx-auto max-w-xl" use:inView={{ onEnter: () => (contactIn = true) }}>
		<div
			class={revealBase}
			class:opacity-0={browser && !contactIn}
			class:translate-y-2={browser && !contactIn}
			class:opacity-100={!browser || contactIn}
			class:translate-y-0={!browser || contactIn}
		>
			<p class="text-accent mb-3 text-xs font-medium tracking-widest uppercase">Get in touch</p>
			<h2 class="text-text mb-6 text-2xl font-bold">Contact</h2>

			<div class="space-y-6 rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
				<p class="text-text/80 leading-relaxed">
					Questions, ideas, feedback — or just want to say hello?
					<br />
					Reach out in whatever way feels easiest for You.
				</p>

				<ul class="space-y-4">
					<!-- 
					nandi: we don't yet have a mailbox set up, I'm not sure if we need it
					<li
						class="rounded-xl bg-cream/70 p-4 ring-1 ring-black/5
						       motion-safe:transition motion-safe:duration-200 motion-safe:ease-out
						       motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
					>
						<p class="font-semibold text-text">Email</p>
						<p class="mt-1 text-sm text-text/70">Send us a message anytime.</p>
					</li> -->

					<li
						class="bg-cream/70 rounded-xl p-4 ring-1 ring-black/5
						       motion-safe:transition motion-safe:duration-200 motion-safe:ease-out
						       motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
					>
						<p class="text-text font-semibold">WhatsApp Community</p>
						<a
							href="https://chat.whatsapp.com/GopSuzuFKRBKeYVKQrX4pE"
							target="_blank"
							rel="noopener noreferrer"
							class="text-accent mt-1 block text-sm underline-offset-4 hover:underline hover:opacity-90 motion-safe:transition"
						>
							Join the conversation
						</a>
					</li>

					<li
						class="bg-cream/70 rounded-xl p-4 ring-1 ring-black/5
						       motion-safe:transition motion-safe:duration-200 motion-safe:ease-out
						       motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
					>
						<p class="text-text font-semibold">Meetup</p>
						<a
							href="https://www.meetup.com/utrechters/"
							target="_blank"
							rel="noopener noreferrer"
							class="text-accent mt-1 block text-sm underline-offset-4 hover:underline hover:opacity-90 motion-safe:transition"
						>
							Message us directly through the Meetup platform.
						</a>
					</li>

					<li
						class="bg-cream/70 rounded-xl p-4 ring-1 ring-black/5
						       motion-safe:transition motion-safe:duration-200 motion-safe:ease-out
						       motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
					>
						<p class="text-text font-semibold">Facebook</p>
						<a
							href="https://www.facebook.com/profile.php?id=61576281328467"
							target="_blank"
							rel="noopener noreferrer"
							class="text-accent mt-1 block text-sm underline-offset-4 hover:underline hover:opacity-90 motion-safe:transition"
						>
							Contact us here
						</a>
					</li>
				</ul>

				<div class="border-t border-black/10 pt-5">
					<p class="text-text/80 leading-relaxed">
						We’ll do our best to respond thoughtfully and in a reasonable time.
					</p>
					<p class="text-text mt-4">
						You don’t need a perfect reason to reach out.
						<br />
						<span class="font-medium">Connection starts small.</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<Footer />
