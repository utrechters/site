<script lang="ts">
	import SvgIcon from "../atoms/svgIcon.svelte"
</script>

<nav class="flex w-full items-center justify-between">
	<a href="/" class="text-sm text-text-muted transition-colors hover:text-text"><span class="text-lg font-bold text-text">UTRECHTERS</span></a>

	<div class="flex items-center gap-6">
		<a href="/#about" class="text-sm text-text-muted transition-colors hover:text-text">About</a>
		<a href="/#rules" class="text-sm text-text-muted transition-colors hover:text-text"
			>Guidelines</a
		>
		<a href="/#contact" class="text-sm text-text-muted transition-colors hover:text-text"
			>Contact</a
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
