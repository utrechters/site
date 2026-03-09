<script lang="ts">
	import SvgIcon from "../atoms/svgIcon.svelte"
</script>

<nav class="flex w-full items-center justify-between">
	<a href="/" class="text-text-muted hover:text-text text-sm transition-colors"
		><span class="text-text text-lg font-bold">UTRECHTERS</span></a
	>

	<div class="flex items-center gap-6">
		<a href="/#about" class="text-text-muted hover:text-text text-sm transition-colors">About</a>
		<a href="/#rules" class="text-text-muted hover:text-text text-sm transition-colors"
			>Guidelines</a
		>
		<a href="/#contact" class="text-text-muted hover:text-text text-sm transition-colors">Contact</a
		>
		<a
			href="https://chat.whatsapp.com/GopSuzuFKRBKeYVKQrX4pE"
			target="_blank"
			rel="noreferrer"
			class="ml-2"
		>
			<SvgIcon src="/whatsapp.svg" alt="WhatsApp Community" />
		</a>
	</div>
</nav>
