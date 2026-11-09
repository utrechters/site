#!/usr/bin/env bash
set -euo pipefail

base=http://localhost:4173

node --import tsx mock/server.ts >/dev/null &
node_modules/.bin/vite preview --port 4173 --strictPort >/dev/null &
trap 'kill $(jobs -p) 2>/dev/null' EXIT

fail() {
	echo "FAIL: $1" >&2
	exit 1
}

expect() {
	grep -qF -- "$3" <<<"$2" || fail "$1 is missing: $3"
}

reject() {
	! grep -qF -- "$3" <<<"$2" || fail "$1 contains: $3"
}

status() {
	local code
	code=$(curl -sS -o /dev/null -w '%{http_code}' "$base$1")
	[[ $code == "$2" ]] || fail "$1 returned $code, expected $2"
}

home=$(curl -fsS --retry 15 --retry-connrefused --retry-delay 1 "$base/")
privacy=$(curl -fsS "$base/privacy")

expect / "$home" "<title>Utrechters |"
expect / "$home" "Mingle Mania"
expect / "$home" "https://www.meetup.com/utrechters/events/mock-tuesday"
expect / "$home" "First Friday's drinks"
expect / "$home" "https://www.meetup.com/utrechters/events/mock-friday"
reject / "$home" "No upcoming events"
for id in about rules faq contact; do
	expect / "$home" "id=\"$id\""
done

node -e '
	const html = require("fs").readFileSync(0, "utf8")
	const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
	if (!blocks.length) throw new Error("no JSON-LD")
	for (const [, json] of blocks) JSON.parse(json)
' <<<"$home" || fail "/ has invalid JSON-LD"

assets=$(grep -o '_app/immutable/[^"]*\.\(js\|css\)' <<<"$home" | sort -u)
[[ -n $assets ]] || fail "/ references no JS or CSS assets"
for asset in $assets; do
	status "/$asset" 200
done

expect /privacy "$privacy" "<title>Privacy Policy | Utrechters</title>"
expect /privacy "$privacy" "Privacy Policy</h1>"

status /does-not-exist 404

echo "smoke test passed"
