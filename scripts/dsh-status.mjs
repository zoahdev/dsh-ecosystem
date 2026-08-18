#!/usr/bin/env node
/**
 * dsh-status.mjs — one-command status for the waiting period:
 * gate countdown, PR states, #2763 family, suite health.
 * Requires gh CLI. Registry lookups use node fetch (no npm shell needed).
 */

import { spawnSync } from 'node:child_process'

const GH = process.platform === 'win32' ? 'gh.exe' : 'gh'
const PRS = [
  [1682, 'add-dsh-dep-audit', '2026-08-18T10:26:22Z'],
  [1684, 'add-dsh-llms-cn', '2026-08-18T10:45:21Z'],
  [1698, 'add-dsh-timesheet', '2026-08-18T12:26:56Z'],
  [1722, 'add-dsh-discussions-radar', '2026-08-18T14:04:16Z'],
  [1727, 'add-dsh-readme-forge', '2026-08-18T14:23:23Z'],
  [1732, 'add-dsh-firstrun', '2026-08-18T14:34:02Z'],
  [1737, 'add-dsh-disk-audit', '2026-08-18T15:02:04Z'],
  [1786, 'add-dsh-quality-score', '2026-08-18T18:58:01Z'],
]
const SUITE = [['dsh-dep-audit','dsh-dep-audit'],['dsh-llms-forge','dsh-llms-forge'],['dsh-cn-boot','dsh-cn-boot'],['dsh-timesheet','dsh-timesheet'],['dsh-discussions-radar','dsh-discussions-radar'],['dsh-readme-forge','dsh-readme-forge'],['dsh-firstrun','dsh-quickstart'],['dsh-disk-audit','dsh-disk-audit'],['dsh-quality-score','dsh-quality-score']]
const FAMILY = ['dsh-tools','dsh-base','dsh-web-app','dsh-headless','dsh-llm','dsh-session','dsh-llm-pi-ai','dsh-sandbox','dsh-subprocess','dsh-client-connection','dsh-system-prompt','dsh-scope','dsh-settings','dsh-host-webserver']

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: 60000, windowsHide: true })
  return { ok: r.status === 0, out: (r.stdout ?? '').trim() }
}

async function fetchLatest(name) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, { headers: { accept: 'application/vnd.npm.install-v1+json' } })
    const data = res.ok ? await res.json() : {}
    return data['dist-tags']?.latest ?? null
  } catch { return null }
}

const now = Date.now()
console.log(`# dsh status — ${new Date(now).toISOString().slice(0, 16)}Z`)

console.log('')
console.log('## Gate countdown (repo age >= 24h)')
const times = PRS.map(([n, b, created]) => ({ n, b, eligible: Date.parse(created) + 86400000 }))
for (const t of times) {
  const mins = Math.ceil((t.eligible - now) / 60000)
  console.log(`  #${t.n} ${t.b}: ${mins > 0 ? `eligible in ${mins}m (${new Date(t.eligible).toISOString().slice(11, 16)}Z)` : 'ELIGIBLE NOW'}`)
}
const next = times.filter((t) => t.eligible > now).sort((a, b) => a.eligible - b.eligible)[0]
if (next) console.log(`  -> next gate at ${new Date(next.eligible).toISOString().slice(0, 16)}Z (${Math.ceil((next.eligible - now) / 60000)}m)`)

console.log('')
console.log('## PRs (awesome-dsh-plugin + 0xsline)')
for (const [n] of PRS) {
  const r = run(GH, ['pr', 'view', String(n), '--repo', 'awesome-dsh-plugin/awesome-dsh-plugin', '--json', 'state,mergeable,mergeStateStatus'])
  try {
    const d = JSON.parse(r.out)
    console.log(`  #${n}: ${d.state} ${d.mergeable} ${d.mergeStateStatus}`)
  } catch { console.log(`  #${n}: query failed`) }
}
{
  const r = run(GH, ['pr', 'view', '401', '--repo', '0xSline/awesome-deepseek-harness', '--json', 'state,mergeable,mergeStateStatus'])
  try {
    const d = JSON.parse(r.out)
    console.log(`  #401 (0xsline): ${d.state} ${d.mergeable} ${d.mergeStateStatus}`)
  } catch { console.log('  #401: query failed') }
}

console.log('')
console.log('## #2763 official family (latest)')
const family = {}
await Promise.all(FAMILY.map(async (pkg) => { family[pkg] = await fetchLatest(`@deepseek-ai/${pkg}`) }))
const stuck = Object.values(family).filter((v) => v === '0.0.1-rc.1').length
console.log(`  ${stuck}/${FAMILY.length} family packages stuck at 0.0.1-rc.1`)

console.log('')
console.log('## Suite (npm latest + CI)')
for (const [pkg, repo] of SUITE) {
  const v = await fetchLatest(pkg)
  const ci = run(GH, ['run', 'list', '--repo', `zoahdev/${repo}`, '--limit', '1', '--json', 'conclusion'])
  let ciState = '?'
  try { ciState = JSON.parse(ci.out)[0]?.conclusion ?? '?' } catch {}
  console.log(`  ${pkg}: v${v ?? '?'} ci=${ciState}`)
}