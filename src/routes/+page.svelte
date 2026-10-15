<script lang="ts">
	import { browser } from "$app/environment"
	import { inView } from "$lib/inView"

	import EventBox from "../components/atoms/eventBox.svelte"
	import Footer from "../components/organisms/footer.svelte"

	let { data } = $props()
	const events = $derived(data.events)

	// Svelte 5 state (runes)
	let aboutIn = $state(false)
	let rulesIn = $state(false)
	let contactIn = $state(false)

	// Helper: classes for "reveal"
	const revealBase = "motion-safe:transition motion-safe:duration-500 motion-safe:ease-out"

	const principles = [
		{
			title: "Be respectful.",
			text: "People from many backgrounds and cultures meet here. Treat everyone with basic decency. It's free, no Tikkie attached."
		},
		{
			title: "We keep notes on serious incidents.",
			text: "If something goes wrong at an event or on WhatsApp, the organizers may write down what happened. We never share these notes publicly. They help us stay fair if stories differ later."
		},
		{
			title: "Welcome new people.",
			text: "Joining a new group isn't easy. If someone is new, say hi and include them. It's the best thing you can do for this community."
		}
	]

	const mainGroupRules = [
		{
			title: "Stay on topic.",
			text: "Post about events, going out, meeting people, language, culture and life in Utrecht. Off-topic chat goes in the “Discuss anything” group."
		},
		{
			title: "Be kind.",
			text: "Members come from all over the world. We remove anyone who discriminates, harasses or insults others."
		},
		{
			title: "Keep it short.",
			text: "Take long conversations to “Discuss anything” or a private chat."
		},
		{
			title: "No advertising.",
			text: "Don't promote businesses, services, paid events or fundraisers. If you're not sure, ask an admin first."
		},
		{
			title: "No politics.",
			text: "Leave out political debate, campaigns and pushing a cause."
		}
	]

	const faq = [
		{
			q: "Why are there several groups?",
			a: "The main group has many members, so it stays focused on meeting up. Other groups, like “Discuss anything”, are for everything else. Join the ones you like."
		},
		{
			q: "Who are the admins?",
			a: "Open the group info. Admins are marked “Group admin” in the member list."
		},
		{
			q: "Someone made me uncomfortable. What do I do?",
			a: "Message an admin privately. We handle it discreetly and don't discuss it in the group."
		},
		{
			q: "Why was my message deleted?",
			a: "It broke one of the rules above. Post it in the right group, or message an admin if you think it was a mistake."
		},
		{
			q: "I'm new and don't know anyone. Is that okay?",
			a: "Most of us joined that way. Come to an event and say hi to the organizer."
		}
	]
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
			class="mb-6 h-56 w-56 rounded-lg object-cover shadow-2xl shadow-black/60"
		/>
		<h1 class="mb-1 text-2xl font-bold tracking-tight text-white">Welcome!</h1>
		<p class="text-sm text-white/50">
			We are the <span class="font-semibold text-white/80">UTRECHTERS</span>.
		</p>
	</div>

	<div class="mt-20 flex w-full max-w-4xl flex-col items-center gap-4">
		<p
			class="text-accent border-accent inline-block border-b-2 pb-1 text-base font-medium tracking-widest uppercase"
		>
			Upcoming Events
		</p>

		{#if events.length}
			<div class="grid w-full grid-cols-1 gap-10 p-2 lg:grid-cols-3 lg:gap-4">
				{#each events as event (event.link)}
					<div class="card-spotlight h-full">
						<EventBox
							text={event.title}
							date={event.date}
							img={event.icon}
							alt=""
							url={event.link}
							dark
						/>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-white/50">No upcoming events right now. Check back soon.</p>
		{/if}
	</div>

	<a
		href="https://www.meetup.com/utrechters/events/"
		target="_blank"
		rel="noreferrer"
		class="absolute bottom-8 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 motion-safe:transition"
	>
		Browse all events &rarr;
	</a>
</section>

<section id="about" class="bg-surface px-4 py-24 sm:py-32">
	<div class="mx-auto max-w-4xl" use:inView={{ onEnter: () => (aboutIn = true) }}>
		<div
			class={`${revealBase} grid gap-10 md:grid-cols-5 md:gap-16`}
			class:opacity-0={browser && !aboutIn}
			class:translate-y-2={browser && !aboutIn}
			class:opacity-100={!browser || aboutIn}
			class:translate-y-0={!browser || aboutIn}
		>
			<div class="md:col-span-2">
				<p
					class="text-accent border-accent mb-3 inline-block border-b-2 pb-1 text-base font-medium tracking-widest uppercase"
				>
					Who we are
				</p>
				<h2 class="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">About Us</h2>
				<p class="border-accent border-l-2 pl-4 text-xl leading-snug font-medium text-white/90">
					A community of locals and expats, operated completely by volunteers.
				</p>
			</div>

			<div class="space-y-6 md:col-span-3 md:pt-9">
				<p class="leading-relaxed text-white/70">
					Utrechters meetup group was founded in 2008 and was previously known as "Make The Most Of
					Utrecht" on Meetup. Our main objective is to organize social events, while we as
					organizers share the fun with all participants.
				</p>
				<div class="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
					<p class="mb-5 text-sm leading-relaxed text-white/70">
						Meetup and running the website are our only recurring costs, and these are shared among
						the core organizers. If you are eager to support us, you can donate here:
					</p>
					<a
						href="https://bunq.me/UtrechtersMeetup"
						target="_blank"
						rel="noreferrer"
						class="bg-accent hover:bg-accent/85 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white motion-safe:transition"
					>
						bunq.me/UtrechtersMeetup <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
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
			<p
				class="text-accent border-accent mb-3 inline-block border-b-2 pb-1 text-base font-medium tracking-widest uppercase"
			>
				Community
			</p>
			<h2 class="text-text mb-6 text-2xl font-bold">Guidelines</h2>

			<div class="bg-cream/60 space-y-6 rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
				<div class="text-text/80 space-y-3 leading-relaxed">
					<p>
						This community helps <span class="text-text font-semibold">you</span> connect, feel welcome
						and meet people in Utrecht. In practice, that means people from all around the globe.
					</p>
					<p>Joining a group full of strangers takes courage. We're here to back you up.</p>
				</div>

				<p class="text-text/80 leading-relaxed">
					To keep this a good place for everyone, we follow a few principles:
				</p>

				<ul class="space-y-4">
					{#each principles as principle (principle.title)}
						<li class="rounded-xl bg-white/60 p-4 ring-1 ring-black/5">
							<p class="text-text font-semibold">{principle.title}</p>
							<p class="text-text/70 mt-1 text-sm leading-relaxed">{principle.text}</p>
						</li>
					{/each}
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

			<h3 class="text-text mt-12 mb-4 text-xl font-bold">WhatsApp rules</h3>

			<div class="bg-cream/60 space-y-6 rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
				<p class="text-text/80 leading-relaxed">
					These rules apply to all our WhatsApp groups. Our groups are large and every message
					reaches every member, so please keep to them:
				</p>

				<ol class="space-y-4">
					{#each mainGroupRules as rule, i (rule.title)}
						<li class="flex gap-4 rounded-xl bg-white/60 p-4 ring-1 ring-black/5">
							<span class="text-accent font-bold" aria-hidden="true">{i + 1}</span>
							<div>
								<p class="text-text font-semibold">{rule.title}</p>
								<p class="text-text/70 mt-1 text-sm leading-relaxed">{rule.text}</p>
							</div>
						</li>
					{/each}
				</ol>

				<p class="text-text/80 text-sm leading-relaxed">
					Admins delete posts that break these rules. If you break them more than once, or once
					seriously, we remove you from the group.
				</p>

				<div class="bg-accent-light rounded-xl p-4">
					<p class="text-text font-semibold">Admission</p>
					<p class="text-text/80 mt-1 text-sm leading-relaxed">
						The organizers can refuse anyone entry to our groups and events, online or in person,
						without notice. We usually explain our decision, but we are not obliged to.
					</p>
				</div>
			</div>

			<h3 class="text-text mt-12 mb-4 text-xl font-bold">How the WhatsApp groups work</h3>

			<div class="space-y-3">
				{#each faq as item (item.q)}
					<details class="group bg-cream/60 rounded-xl p-4 ring-1 ring-black/5">
						<summary
							class="text-text flex cursor-pointer list-none items-center justify-between gap-4 font-semibold"
						>
							{item.q}
							<span
								class="text-accent group-open:rotate-45 motion-safe:transition-transform"
								aria-hidden="true">+</span
							>
						</summary>
						<p class="text-text/70 mt-2 text-sm leading-relaxed">{item.a}</p>
					</details>
				{/each}
			</div>

			<div class="mt-12 text-center">
				<p class="text-text/80 mb-5 leading-relaxed">
					Most of our communication happens in our WhatsApp community.
				</p>
				<a
					href="https://chat.whatsapp.com/GopSuzuFKRBKeYVKQrX4pE"
					target="_blank"
					rel="noreferrer"
					class="bg-accent hover:bg-accent/85 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white motion-safe:transition"
				>
					Join us on WhatsApp <span aria-hidden="true">&rarr;</span>
				</a>
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
			<p
				class="text-accent border-accent mb-3 inline-block border-b-2 pb-1 text-base font-medium tracking-widest uppercase"
			>
				Get in touch
			</p>
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
							href="/p/whatsapp"
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
