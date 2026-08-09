#!/usr/bin/env node
// Validates all item files in src/lib/data/items/ against item.schema.json.
// Also checks id prefix, global uniqueness, and i18n/en coverage.
// Run with: node scripts/validate-data.js
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import Ajv from "ajv"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const CODES = ["ch", "hu", "ro", "nl"]
const schema = JSON.parse(readFileSync(resolve(root, "src/lib/data/item.schema.json"), "utf8"))

const ajv = new Ajv()
const validate = ajv.compile(schema)

let exitCode = 0
const allIds = new Map() // id → filename
const allItems = []

// ── Schema + prefix check ────────────────────────────────────────────────────
console.log("=== Schema + prefix validation ===")
for (const code of CODES) {
	const file = `src/lib/data/items/${code}.json`
	const items = JSON.parse(readFileSync(resolve(root, file), "utf8"))

	const ok = validate(items)
	if (!ok) {
		for (const err of validate.errors ?? []) {
			console.error(`  ✗ ${file}: ${err.instancePath} ${err.message}`)
			exitCode = 1
		}
	}

	for (const item of items) {
		if (!item.id.startsWith(code + "-")) {
			console.error(`  ✗ ${file}: "${item.id}" must start with "${code}-"`)
			exitCode = 1
		}
		allItems.push({ ...item, _file: code })
	}
	console.log(`  ${ok ? "✓" : "✗"} ${file}: ${items.length} items`)
}

// ── Uniqueness ───────────────────────────────────────────────────────────────
console.log("\n=== Global uniqueness ===")
let uniqueOk = true
for (const item of allItems) {
	if (allIds.has(item.id)) {
		console.error(`  ✗ Duplicate id "${item.id}" in ${item._file}.json and ${allIds.get(item.id)}`)
		exitCode = 1
		uniqueOk = false
	} else {
		allIds.set(item.id, item._file + ".json")
	}
}
console.log(uniqueOk ? `  ✓ All ${allIds.size} ids are globally unique` : "  ✗ Duplicates found")

// ── i18n/en coverage ─────────────────────────────────────────────────────────
console.log("\n=== i18n/en coverage ===")
let orphans = []
for (const code of CODES) {
	const strings = JSON.parse(
		readFileSync(resolve(root, `src/lib/data/i18n/en/${code}.json`), "utf8")
	)
	const items = allItems.filter((i) => i._file === code)
	for (const item of items) {
		if (!strings[item.id]) orphans.push(item.id)
	}
	console.log(
		`  ${orphans.filter((o) => o.startsWith(code + "-")).length === 0 ? "✓" : "✗"} ` +
			`i18n/en/${code}.json: ${Object.keys(strings).length} strings for ${items.length} items`
	)
}
if (orphans.length > 0) {
	console.error(`  ✗ Orphan ids (missing en string): ${orphans.join(", ")}`)
	exitCode = 1
} else {
	console.log("  ✓ No orphans")
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${exitCode === 0 ? "✓ All checks passed." : "✗ Validation failed."}`)
process.exit(exitCode)
