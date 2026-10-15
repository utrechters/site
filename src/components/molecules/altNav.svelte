<script lang="ts">
	import SvgIcon from "../atoms/svgIcon.svelte"

	let { class: className = "" }: { class?: string } = $props()
</script>

<a href="/p/whatsapp" target="_blank" rel="noreferrer" class="ml-auto w-6 {className}">
	<SvgIcon src="/whatsapp.svg" alt="WhatsApp link to the Community" />
</a>
