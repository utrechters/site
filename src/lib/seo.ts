import type { EventLink } from "../routes/+page.server"

export const SITE_URL = "https://utrechters.net"

type Venue = {
	name: string
	streetAddress: string
	postalCode: string
	map: string
	startTime?: string
}

export const TUESDAY_VENUE: Venue = {
	name: "Mick O'Connells",
	streetAddress: "Jansdam 3",
	postalCode: "3512 HA",
	map: "https://maps.app.goo.gl/mJ5Q1RD648Vd32zJ9"
}

const ORG_ID = `${SITE_URL}/#organization`

const organization = {
	"@type": "Organization",
	"@id": ORG_ID,
	name: "Utrechters",
	alternateName: "Make The Most Of Utrecht",
	url: SITE_URL,
	logo: `${SITE_URL}/utrechters.png`,
	description:
		"Volunteer-run meetup community for expats and locals in Utrecht, the Netherlands. Free weekly meetups every Tuesday and drinks on the first Friday of each month.",
	foundingDate: "2008",
	areaServed: { "@type": "City", name: "Utrecht" },
	sameAs: [
		"https://www.meetup.com/utrechters/",
		"https://www.facebook.com/profile.php?id=61576281328467",
		"https://www.github.com/utrechters/site"
	]
}

const website = {
	"@type": "WebSite",
	"@id": `${SITE_URL}/#website`,
	url: SITE_URL,
	name: "Utrechters",
	inLanguage: "en",
	publisher: { "@id": ORG_ID }
}

const utrecht = {
	"@type": "Place",
	name: "Utrecht",
	address: { "@type": "PostalAddress", addressLocality: "Utrecht", addressCountry: "NL" }
}

const eventBase = {
	eventStatus: "https://schema.org/EventScheduled",
	eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
	isAccessibleForFree: true,
	organizer: { "@id": ORG_ID }
}

function tuesdayEvent(venue: Venue) {
	return {
		"@type": "Event",
		...eventBase,
		name: "Utrechters weekly Tuesday meetup",
		description: "Free weekly meetup for expats and locals in Utrecht.",
		url: SITE_URL,
		location: {
			"@type": "Place",
			name: venue.name,
			hasMap: venue.map,
			address: {
				"@type": "PostalAddress",
				streetAddress: venue.streetAddress,
				postalCode: venue.postalCode,
				addressLocality: "Utrecht",
				addressCountry: "NL"
			}
		},
		eventSchedule: {
			"@type": "Schedule",
			repeatFrequency: "P1W",
			byDay: "https://schema.org/Tuesday",
			startTime: venue.startTime,
			scheduleTimezone: "Europe/Amsterdam"
		}
	}
}

export function jsonLd(events: EventLink[], faq: { q: string; a: string }[]): string {
	const graph: object[] = [
		organization,
		website,
		{
			"@type": "FAQPage",
			mainEntity: faq.map(({ q, a }) => ({
				"@type": "Question",
				name: q,
				acceptedAnswer: { "@type": "Answer", text: a }
			}))
		},
		...events.map((e) => ({
			"@type": "Event",
			...eventBase,
			name: e.title,
			url: e.link,
			startDate: e.date.toISOString(),
			image: `${SITE_URL}${e.icon}`,
			location: utrecht
		})),
		tuesdayEvent(TUESDAY_VENUE)
	]

	const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
	return `<script type="application/ld+json">${json.replace(/</g, "\\u003c")}</script>`
}
