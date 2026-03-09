<script lang="ts">
	import SvgIcon from "../atoms/svgIcon.svelte"

	const year = new Date().getFullYear()
</script>

<footer class="bg-surface flex w-full flex-col items-center gap-3 py-5">
	<a
		href="https://www.github.com/utrechters/site"
		target="_blank"
		rel="noreferrer"
		class="flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white"
	>
		<SvgIcon src="/github.svg" alt="GitHub" />
		<span>Contribute on GitHub</span>
	</a>
	<a href="/privacy" class="text-xs text-white/40 transition-colors hover:text-white/70"
		>Privacy Policy</a
	>
	<p class="text-xs text-white/30">{year} &copy; Creators</p>
</footer>
