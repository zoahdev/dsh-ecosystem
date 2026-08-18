#!/usr/bin/env node
/**
 * Full-registry #2763 impact scan.
 *
 * Reads the live dsh-subscribe registry and checks every npm-installable
 * plugin's declared @deepseek-ai/dsh-tools range against the broken latest
 * dist-tag (0.0.1-rc.1). Fast mode: single abbreviated-metadata fetch per
 * package, no dependency expansion.
 */

import { readFileSync } from 'node:fs'
import { satisfies, isRegistryRange } from './dsh-dep-audit/lib/version.js'

// Registry source: --registry-url <url> (fetched) or a local JSON path.
const REGISTRY_URL = process.argv.find((a) => a.startsWith('--registry-url='))?.slice('--registry-url='.length)
const REGISTRY_PATH = process.argv[2] ?? './dsh-subscribe/registry.json'
const CONCURRENCY = 6

function encode(name) {
  return name.startsWith('@') ? name.replace('/', '%2F') : name
}

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
    const data = await res.json()
    return { status: 200, data }
  } catch {
    return { status: 0 }
  } finally {
    clearTimeout(timer)
  }
}

function dshToolsRange(versionMeta) {
  const tables = [versionMeta?.dependencies, versionMeta?.peerDependencies]
  for (const t of tables) {
    const range = t?.['@deepseek-ai/dsh-tools']
    if (typeof range === 'string' && isRegistryRange(range)) return { source: t === versionMeta?.dependencies ? 'dep' : 'peer', range }
  }
  return null
}

async function loadRegistry() {
  if (REGISTRY_URL !== undefined) {
    const res = await fetch(REGISTRY_URL)
    if (!res.ok) throw new Error(`registry fetch failed: HTTP ${res.status}`)
    return await res.json()
  }
  return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'))
}

async function main() {
  const reg = await loadRegistry()
  const plugins = reg.plugins.filter((p) => p.install?.target === 'npm')
  const names = [...new Set(plugins.map((p) => p.install.spec))]

  const dshTools = await fetchAbbrev('@deepseek-ai/dsh-tools')
  const dshToolsLatest = dshTools.data?.['dist-tags']?.latest ?? null

  const results = []
  let cursor = 0
  async function worker() {
    while (cursor < names.length) {
      const name = names[cursor++]
      const info = await fetchAbbrev(name)
      if (info.status !== 200 || !info.data) {
        results.push({ name, status: info.status })
        continue
      }
      const latest = info.data['dist-tags']?.latest ?? null
      const meta = latest ? info.data.versions?.[latest] : undefined
      const decl = meta ? dshToolsRange(meta) : null
      if (decl === null) {
        results.push({ name, status: 200, declares: false })
        continue
      }
      const affected = dshToolsLatest !== null && !satisfies(dshToolsLatest, decl.range)
      results.push({ name, status: 200, declares: true, source: decl.source, range: decl.range, latest, affected })
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

  const declared = results.filter((r) => r.declares === true)
  const affected = declared.filter((r) => r.affected)
  const ok = declared.filter((r) => !r.affected)
  const unknown = results.filter((r) => r.status !== 200)
  const total = names.length

  const lines = []
  lines.push(`# Full-registry #2763 impact — ${new Date().toISOString().slice(0, 10)}`)
  lines.push('')
  lines.push(`- npm-installable plugin packages in registry: **${total}**`)
  lines.push(`- declare an @deepseek-ai/dsh-tools range: **${declared.length}** (peer: ${declared.filter((r) => r.source === 'peer').length}, dep: ${declared.filter((r) => r.source === 'dep').length})`)
  lines.push(`- **AFFECTED by broken latest (0.0.1-rc.1): ${affected.length}**`)
  lines.push(`- not affected: ${ok.length}`)
  lines.push(`- unknown (fetch failed): ${unknown.length}`)
  lines.push('')
  lines.push('| Plugin | source | declared range | latest resolves | affected |')
  lines.push('|---|---|---|---|---|')
  for (const r of affected) {
    lines.push(`| ${r.name} | ${r.source} | ${r.range} | ${r.latest} | YES |`)
  }
  lines.push('')
  process.stdout.write(lines.join('\n') + '\n')
}

main()