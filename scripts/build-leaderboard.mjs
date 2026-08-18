import { readFileSync, writeFileSync } from 'node:fs'

let text = readFileSync(process.argv[2], 'utf8')
// Only the first (41-package) table: stop at the full-registry section.
text = text.split('## Full-registry impact')[0]
const rows = []
for (const line of text.split(/\r?\n/)) {
  if (!line.startsWith('|')) continue
  const cells = line.split('|').map((s) => s.trim())
  const pkg = cells[1] ?? ''
  if (pkg === '' || pkg === 'Package' || /^:?-+$/.test(pkg)) continue
  const latest = cells[2] ?? ''
  const next = cells[3] ?? ''
  const mismatch = cells[4] ?? ''
  const dead = cells[5] ?? ''
  const affected = cells[6] ?? ''
  const distTag = (mismatch === 'WARN') ? 0 : 15
  const deadCount = dead === '' ? 0 : dead.split('<br>').filter(Boolean).length
  const deadScore = deadCount === 0 ? 15 : Math.max(0, 15 - deadCount * 5)
  const peerScore = affected === '' ? 10 : 0
  const partial = distTag + deadScore + peerScore
  rows.push({ pkg, latest, next, distTag, deadCount, deadScore, peerScore, partial })
}
rows.sort((a, b) => b.partial - a.partial || a.pkg.localeCompare(b.pkg))
const lines = []
lines.push('# dsh plugin quality leaderboard — v0 (2026-08-19)')
lines.push('')
lines.push('> Partial score = known components only (dist-tag 15 + dead-ranges 15 + dsh-tools-peer 10, max 40). Manifest/freshness/peer-resolvability need online metadata and are NOT included yet. Full scoring ships with dsh-quality-score when network returns.')
lines.push('')
lines.push('| Rank | Package | Partial/40 | Dist-tag | Dead ranges | dsh-tools peer |')
lines.push('|---|---|---|---|---|---|')
rows.forEach((r, i) => {
  lines.push(`| ${i + 1} | ${r.pkg} | ${r.partial}/40 | ${r.distTag}/15${r.latest !== r.next && r.next !== '' ? ` (latest=${r.latest}, next=${r.next})` : ''} | ${r.deadScore}/15${r.deadCount > 0 ? ` (${r.deadCount})` : ''} | ${r.peerScore}/10 |`)
})
lines.push('')
writeFileSync(process.argv[3], lines.join('\n') + '\n')
console.log(`rows: ${rows.length}`)