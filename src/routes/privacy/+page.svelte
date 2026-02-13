<script lang="ts">
	import Footer from "../../components/organisms/footer.svelte"
</script>

<section class="bg-cream px-4 py-20">
	<article class="mx-auto max-w-xl">
		<h1 class="mb-8 text-3xl font-bold text-text">Privacy Policy</h1>

		<h2 class="mb-2 mt-8 text-lg font-semibold text-text">1. Who we are</h2>
		<p class="mb-4 leading-relaxed text-text-muted">
			This website is operated by the Utrechters community. If you have any questions about this
			Privacy Policy, you can contact us on GitHub or email.
		</p>

		<h2 class="mb-2 mt-8 text-lg font-semibold text-text">2. Hosting</h2>
		<p class="mb-4 leading-relaxed text-text-muted">
			This website is hosted within the European Union. All data processing takes place on servers
			located in the EU.
		</p>

		<h2 class="mb-2 mt-8 text-lg font-semibold text-text">3. Analytics</h2>
		<p class="mb-4 leading-relaxed text-text-muted">
			We use a self-hosted, privacy-friendly analytics tool (Umami) to understand how visitors use
			our website.
		</p>
		<div class="mb-4 grid gap-4 sm:grid-cols-2">
			<div>
				<p class="mb-1 text-sm font-medium text-text">What is collected</p>
				<ul class="list-inside list-disc text-sm leading-relaxed text-text-muted">
					<li>Visited pages</li>
					<li>Referrer website</li>
					<li>Browser &amp; device type</li>
					<li>Country (anonymized IP)</li>
					<li>Date and time of visit</li>
				</ul>
			</div>
			<div>
				<p class="mb-1 text-sm font-medium text-text">What is NOT collected</p>
				<ul class="list-inside list-disc text-sm leading-relaxed text-text-muted">
					<li>No cookies</li>
					<li>No personal data</li>
					<li>No full IP addresses</li>
					<li>No cross-site tracking</li>
					<li>No third-party data sharing</li>
				</ul>
			</div>
		</div>
		<p class="mb-4 leading-relaxed text-text-muted">
			The collected information cannot be used to identify individual visitors. Processing is based
			on our legitimate interest (Article 6(1)(f) GDPR).
		</p>

		<h2 class="mb-2 mt-8 text-lg font-semibold text-text">4. Contact</h2>
		<p class="mb-4 leading-relaxed text-text-muted">
			If you contact us via email or contact form, we process the data you provide solely to respond
			to your inquiry. Legal basis: Article 6(1)(b) and 6(1)(f) GDPR. We do not share this data
			with third parties unless legally required.
		</p>

		<h2 class="mb-2 mt-8 text-lg font-semibold text-text">5. Data retention</h2>
		<p class="mb-4 leading-relaxed text-text-muted">
			Anonymous analytics data is stored only as long as necessary for statistical purposes. Personal
			data provided via contact is deleted once your request has been resolved, unless legal
			retention obligations apply.
		</p>

		<h2 class="mb-2 mt-8 text-lg font-semibold text-text">6. Your rights under GDPR</h2>
		<p class="mb-2 leading-relaxed text-text-muted">
			Under the General Data Protection Regulation, you have the right to:
		</p>
		<ul class="mb-4 list-inside list-disc text-sm leading-relaxed text-text-muted">
			<li>Access your data</li>
			<li>Rectify inaccurate data</li>
			<li>Erase your data</li>
			<li>Restrict processing</li>
			<li>Data portability</li>
			<li>Object to processing</li>
			<li>Lodge a complaint with a supervisory authority</li>
		</ul>

		<h2 class="mb-2 mt-8 text-lg font-semibold text-text">7. Changes</h2>
		<p class="leading-relaxed text-text-muted">
			We may update this Privacy Policy to reflect legal or technical changes. The latest version
			will always be available on this page.
		</p>
	</article>
</section>

<Footer />
