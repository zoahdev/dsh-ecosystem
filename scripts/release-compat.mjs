#!/usr/bin/env node
/**
 * Official release compatibility report.
 *
 * For a given release train (e.g. 0.1.0-rc.6), checks:
 *  - npm dist-tags for @deepseek-ai/dsh (which tag points where)
 *  - latest CI conclusion for every zoahdev dsh repo
 *  - known caveats tracked by the ecosystem map
 *
 * Writes a Markdown report to docs/release-compat/<version>.md.
 *
 * Usage: node scripts/release-compat.mjs --version 0.1.0-rc.6 [--out path]
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--version') { args.version = argv[i + 1]; i += 1 }
    if (argv[i] === '--out') { args.out = argv[i + 1]; i += 1 }
  }
  return args
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'dsh-ecosystem-release-compat' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

const REPOS = [
  'dsh-github-intelligence',
  'dsh-plugin-doctor',
  'dsh-plugin-search',
  'dsh-github-release-radar',
  'dsh-plugin-template',
  'dsh-subscribe',
]

const CAVEATS = [
  '#1697 dual-instance unique-symbol bug: root cause confirmed, Symbol.for + protocol guard staged on zoahdev fork',
  '#1686 dsh web boot on Linux CI (missing pty.node): workaround is Windows runner for web boot',
  'npm dist-tag hygiene: latest historically pointed at broken 0.0.1-rc.1; community plugins pin to the tested rc train',
]

async function main() {
  const { version, out } = parseArgs(process.argv.slice(2))
  if (!version) {
    console.error('usage: node scripts/release-compat.mjs --version <release-train>')
    process.exit(1)
  }

  const npm = await fetchJson('https://registry.npmjs.org/@deepseek-ai/dsh')
  const distTags = npm['dist-tags'] ?? {}

  const rows = []
  for (const repo of REPOS) {
    try {
      const runs = await fetchJson(`https://api.github.com/repos/zoahdev/${repo}/actions/runs?per_page=1`)
      const run = runs.workflow_runs?.[0]
      rows.push({
        repo,
        status: run ? `${run.status}/${run.conclusion ?? 'pending'}` : 'no runs',
        head: run ? run.head_sha.slice(0, 10) : '—',
        at: run ? (run.created_at ?? '').slice(0, 10) : '—',
      })
    } catch (error) {
      rows.push({ repo, status: `error: ${error.message}`, head: '—', at: '—' })
    }
  }

  const lines = []
  lines.push(`# Release compatibility report — ${version}`)
  lines.push('')
  lines.push(`> Generated ${new Date().toISOString()} by [dsh-ecosystem](https://github.com/zoahdev/dsh-ecosystem) · sources: npm registry + GitHub Actions API`)
  lines.push('')
  lines.push('## npm dist-tags (`@deepseek-ai/dsh`)')
  lines.push('')
  lines.push('| Tag | Version |')
  lines.push('| --- | --- |')
  for (const [tag, v] of Object.entries(distTags).sort()) lines.push(`| \`${tag}\` | \`${v}\` |`)
  lines.push('')
  lines.push('## zoahdev suite CI (latest run)')
  lines.push('')
  lines.push('| Repo | Latest CI | Head | Date |')
  lines.push('| --- | --- | --- | --- |')
  for (const row of rows) lines.push(`| [${row.repo}](https://github.com/zoahdev/${row.repo}/actions) | ${row.status} | \`${row.head}\` | ${row.at} |`)
  lines.push('')
  lines.push('## Known caveats')
  lines.push('')
  for (const caveat of CAVEATS) lines.push(`- ${caveat}`)
  lines.push('')
  lines.push('## What this report means')
  lines.push('')
  lines.push('- A green suite row means: pack → fresh profile install → real tool invocation → web boot all passed on CI.')
  lines.push('- This is a community signal, not an official certification.')
  lines.push('- Per-plugin verified details: https://github.com/zoahdev/dsh-subscribe (registry verified layer).')

  const target = path.resolve(ROOT, out ?? `docs/release-compat/${version}.md`)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, lines.join('\n') + '\n', 'utf8')
  console.log(`wrote ${path.relative(ROOT, target)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
