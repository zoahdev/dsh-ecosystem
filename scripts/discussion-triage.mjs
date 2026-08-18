#!/usr/bin/env node
/**
 * discussion-triage.mjs — nightly community-support triage for the dsh official
 * discussions. One GraphQL request lists the newest 100 discussions with their
 * comment authors, marks which ones we already replied to, and prints a queue of
 * zero-comment candidates (bug reports / questions no one has answered).
 *
 * Usage:
 *   node discussion-triage.mjs                     # last 24h window
 *   node discussion-triage.mjs --since 48          # last 48h
 *   node discussion-triage.mjs --all               # no time window
 *   node discussion-triage.mjs --json              # machine-readable
 *
 * Requires: gh CLI authenticated (used only to read the username + GraphQL).
 */

import { spawnSync } from 'node:child_process'

const OWNER = 'deepseek-ai'
const REPO = 'deepseek-harness'
const SINCE_ARG = process.argv.find((a) => a.startsWith('--since='))?.slice('--since='.length) ?? process.argv[process.argv.indexOf('--since') + 1] ?? '24'
const HOURS = Number(SINCE_ARG)
const ALL = process.argv.includes('--all')
const JSON_OUT = process.argv.includes('--json')
const GH = process.platform === 'win32' ? 'gh.exe' : 'gh'

function gh(args) {
  const r = spawnSync(GH, args, { encoding: 'utf8', windowsHide: true, timeout: 120000 })
  if (r.status !== 0) throw new Error(`gh ${args.join(' ')} failed: ${r.stderr || r.stdout}`)
  return r.stdout.trim()
}

const me = gh(['api', 'user', '--jq', '.login'])
const query = `query { repository(owner: "${OWNER}", name: "${REPO}") { discussions(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) { nodes { number title createdAt updatedAt comments(first: 50) { totalCount nodes { author { login } } } } } } }`
const data = JSON.parse(gh(['api', 'graphql', '-f', `query=${query}`]))
const nodes = data.data.repository.discussions.nodes

const now = Date.now()
const cutoff = ALL ? 0 : now - HOURS * 3600_000
const rows = []
for (const d of nodes) {
  const updated = Date.parse(d.updatedAt)
  if (updated < cutoff) continue
  const authors = new Set((d.comments.nodes ?? []).map((c) => c.author?.login).filter(Boolean))
  rows.push({
    number: d.number,
    title: d.title,
    updatedAt: d.updatedAt,
    total: d.comments.totalCount,
    ours: authors.has(me),
  })
}
rows.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))

if (JSON_OUT) {
  console.log(JSON.stringify({ generated: new Date().toISOString(), me, window: ALL ? 'all' : `${HOURS}h`, discussions: rows }, null, 2))
  process.exit(0)
}

console.log(`# dsh discussion triage — ${new Date().toISOString().slice(0, 16)}Z · window: ${ALL ? 'all' : HOURS + 'h'} · me: ${me}`)
console.log('')
console.log('| # | comments | ours | updated | title |')
console.log('|---|---|---|---|---|')
for (const r of rows) {
  const t = r.title.length > 60 ? r.title.slice(0, 59) + '…' : r.title
  console.log(`| ${r.number} | ${r.total} | ${r.ours ? '✅' : ''} | ${r.updatedAt.slice(0, 16)} | ${t.replace(/\|/g, '\\|')} |`)
}
const zero = rows.filter((r) => r.total === 0 && !r.ours)
console.log('')
console.log(`Unanswered candidates (0 comments): ${zero.length}`)
for (const r of zero) console.log(`  #${r.number} — ${r.title}`)