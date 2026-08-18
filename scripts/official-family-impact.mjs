#!/usr/bin/env node
/**
 * official-family-impact.mjs — extend the #2763 impact scan from "dsh-tools
 * peer only" to EVERY @deepseek-ai/* sub-package a registry plugin declares.
 *
 * For each npm-installable plugin we read its abbreviated metadata (same fetch
 * as full-registry-scan), collect every @deepseek-ai/* dependency/peer range,
 * and check whether the package's CURRENT latest satisfies it. A plugin is
 * "affected by bad latest" if any official range fails against latest.
 *
 * Usage: node scripts/official-family-impact.mjs [registry.json] [--out file.md]
 */

import { readFileSync, writeFileSync } from 'node:fs'

const REGISTRY_PATH = process.argv[2] ?? './dsh-subscribe/registry.json'
const OUT = process.argv.find((a) => a.startsWith('--out='))?.slice('--out='.length)
const WHATIF = process.argv.includes('--what-if')
const LIST = process.argv.includes('--list')
const CONCURRENCY = 6

function encode(name) { return name.startsWith('@') ? name.replace('/', '%2F') : name }

async function fetchAbbrev(name, timeoutMs = 20000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    let res = await fetch(`https://registry.npmjs.org/${encode(name)}`, {
      headers: { accept: 'application/vnd.npm.install-v1+json' },
      signal: controller.signal,
    })
    for (let attempt = 0; res.status === 429 && attempt < 4; attempt++) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1) + Math.random() * 500))
      res = await fetch(`https://registry.npmjs.org/${encode(name)}`, {
        headers: { accept: 'application/vnd.npm.install-v1+json' },
        signal: controller.signal,
      })
    }
    if (res.status === 404) return { status: 404 }
    if (!res.ok) return { status: res.status }
    return { status: 200, data: await res.json() }
  } catch { return { status: 0 } } finally { clearTimeout(timer) }
}

import { satisfies } from './dsh-dep-audit/lib/version.js'
const reg = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'))
const plugins = reg.plugins.filter((p) => p.install?.target === 'npm')
const names = [...new Set(plugins.map((p) => p.install.spec))]

// 1) official family dist-tags (dynamic from the registry's own references)
const officialTags = new Map()
async function officialLatest(pkg) {
  if (officialTags.has(pkg)) return officialTags.get(pkg)
  const info = await fetchAbbrev(pkg)
  const tags = info.data?.['dist-tags'] ?? {}
  const resolved = tags.latest ?? null
  const latest = (WHATIF && resolved === '0.0.1-rc.1' ? tags.next : resolved) ?? null
  officialTags.set(pkg, latest)
  return latest
}

const results = []
const pkgHits = new Map() // official pkg -> count of affected plugins
let cursor = 0
async function worker() {
  while (cursor < names.length) {
    const name = names[cursor++]
    const info = await fetchAbbrev(name)
    if (info.status !== 200) { results.push({ name, error: `fetch ${info.status}` }); continue }
    const vm = info.data?.versions?.[info.data['dist-tags']?.latest] ?? info.data
    const ranges = []
    for (const tableName of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const [dep, range] of Object.entries(vm?.[tableName] ?? {})) {
        if (dep.startsWith('@deepseek-ai/')) ranges.push({ dep, range, table: tableName })
      }
    }
    const fails = []
    for (const r of ranges) {
      const latest = await officialLatest(r.dep)
      if (latest !== null && !satisfies(latest, r.range)) {
        fails.push({ ...r, latest })
      }
    }
    results.push({ name, officialRanges: ranges.length, fails })
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

const affected = results.filter((r) => r.fails && r.fails.length > 0)
for (const r of affected) for (const f of r.fails) {
  const k = `${f.dep} (latest ${f.latest})`
  pkgHits.set(k, (pkgHits.get(k) ?? 0) + 1)
}

const lines = []
lines.push('# Official @deepseek-ai family impact (extended #2763 scan)')
lines.push('')
lines.push(`> Generated ${new Date().toISOString().slice(0, 16)}Z · registry ${reg.count} plugins (${names.length} npm-installable) · every @deepseek-ai/* declared range checked against the package\\'s current latest.`)
lines.push('')
lines.push(`**Affected plugins: ${affected.length} / ${names.length}** (a plugin fails when ANY official range is unsatisfied by latest)`)
lines.push('')
lines.push('## Affected official packages (by plugin count)')
lines.push('')
lines.push('| official package | affected plugins |')
lines.push('|---|---|')
for (const [k, v] of [...pkgHits.entries()].sort((a, b) => b[1] - a[1])) lines.push(`| ${k} | ${v} |`)
lines.push('')
lines.push('## Top failing ranges')
lines.push('')
const failCounts = new Map()
for (const r of affected) for (const f of r.fails) {
  const k = `${f.dep}: ${f.range}`
  failCounts.set(k, (failCounts.get(k) ?? 0) + 1)
}
lines.push('| declared range | plugins |')
lines.push('|---|---|')
for (const [k, v] of [...failCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)) lines.push(`| ${k} | ${v} |`)

if (LIST && affected.length > 0) {
  const names = affected.map((r) => r.name).sort()
  console.log('')
  console.log(`## Affected plugins (${names.length})`)
  console.log('')
  console.log(names.map((n) => '- ' + n).join('\n'))
}
const text = lines.join('\n') + '\n'
console.log(text)
if (OUT) writeFileSync(OUT, text, 'utf8')