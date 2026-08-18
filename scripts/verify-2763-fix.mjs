#!/usr/bin/env node
/**
 * verify-2763-fix.mjs — automated verification for the #2763 fix day.
 *
 * 1. Checks @deepseek-ai/dsh-tools `latest` dist-tag.
 * 2. If still 0.0.1-rc.1 -> prints "not fixed yet" (exit 0).
 * 3. If changed -> re-runs the full-registry scan + quality leaderboard,
 *    computes the impact drop, and writes a dated report.
 *
 * Usage: node verify-2763-fix.mjs [--registry <path>] [--out <dir>]
 */

import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WORK = path.resolve(path.dirname(fileURLToPath(import.meta.url)))
const REGISTRY = path.resolve(process.argv.find((a) => a.startsWith('--registry='))?.slice('--registry='.length) ?? path.join(WORK, 'dsh-subscribe', 'registry.json'))
const OUT = path.resolve(process.argv.find((a) => a.startsWith('--out='))?.slice('--out='.length) ?? path.join(WORK, '..', 'outputs'))
const BROKEN_LATEST = '0.0.1-rc.1'

const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function quoteArg(arg) {
  return /^[A-Za-z0-9_./:=-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`
}

function run(cmd, args, cwd = WORK) {
  let r
  if (process.platform === 'win32') {
    r = spawnSync(`${cmd} ${args.map(quoteArg).join(' ')}`, { cwd, encoding: 'utf8', timeout: 600000, windowsHide: true, shell: true, stdio: ['ignore', 'pipe', 'pipe'] })
  } else {
    r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 600000, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  }
  return { status: r.status ?? -1, out: `${r.stdout ?? ''}${r.stderr ?? ''}` }
}

// Official family whose latest was stuck at 0.0.1-rc.1 on 2026-08-19 (12/14 sampled).
const FAMILY = ['dsh-tools', 'dsh-base', 'dsh-web-app', 'dsh-headless', 'dsh-llm', 'dsh-session', 'dsh-llm-pi-ai', 'dsh-sandbox', 'dsh-subprocess', 'dsh-client-connection', 'dsh-system-prompt', 'dsh-scope', 'dsh-settings', 'dsh-host-webserver']

async function familyStatus() {
  const rows = []
  for (const pkg of FAMILY) {
    try {
      const res = await fetch(`https://registry.npmjs.org/@deepseek-ai%2F${pkg}`, {
        headers: { accept: 'application/vnd.npm.install-v1+json' },
      })
      if (!res.ok) { rows.push({ pkg, error: `HTTP ${res.status}` }); continue }
      const data = await res.json()
      const tags = data['dist-tags'] ?? {}
      rows.push({ pkg, latest: tags.latest ?? null, next: tags.next ?? null })
    } catch (e) {
      rows.push({ pkg, error: String(e) })
    }
  }
  return rows
}

async function main() {
  const date = new Date().toISOString().slice(0, 10)
  const status = await familyStatus()
  const stuck = status.filter((r) => r.latest === BROKEN_LATEST)
  const moved = status.filter((r) => r.latest !== undefined && r.latest !== BROKEN_LATEST)
  console.log(`official family check (${status.length} packages):`)
  for (const r of status) {
    console.log(`  ${r.pkg}: latest=${r.latest ?? '?'} next=${r.next ?? '-'}${r.error ? ` ERROR ${r.error}` : ''}`)
  }
  const tools = status.find((r) => r.pkg === 'dsh-tools')
  if (stuck.length === status.length || (tools && tools.latest === BROKEN_LATEST)) {
    console.log(`NOT FIXED YET — ${stuck.length}/${status.length} family packages still stuck at ${BROKEN_LATEST}. No re-scan needed.`)
    return
  }

  console.log(`FIX DETECTED — ${moved.length}/${status.length} family packages moved off ${BROKEN_LATEST}. Re-scanning registry and leaderboard...`)
  const scan = run('node', [path.join(WORK, 'full-registry-scan.mjs')])
  const scanFile = path.join(OUT, `full-registry-impact-${date}.txt`)
  writeFileSync(scanFile, scan.out, 'utf8')

  const qs = path.join(WORK, 'dsh-quality-score')
  const scores = run('node', [path.join(qs, 'lib', 'bin.js'), '--batch-registry', REGISTRY, '--json'], qs)
  const scoresFile = path.join(OUT, `quality-scores-${date}.json`)
  writeFileSync(scoresFile, scores.out, 'utf8')

  const board = run('node', [path.join(qs, 'scripts', 'leaderboard.mjs'), scoresFile])
  const boardFile = path.join(OUT, `quality-leaderboard-${date}.md`)
  writeFileSync(boardFile, board.out, 'utf8')

  const parsed = JSON.parse(scores.out)
  const valid = parsed.filter((s) => s.error === '' || s.error === undefined)
  const gradeOf = (n) => (n >= 95 ? 'A' : n >= 85 ? 'B' : n >= 70 ? 'C' : n >= 55 ? 'D' : 'F')
  const dist = {}
  for (const s of valid) dist[gradeOf(s.score)] = (dist[gradeOf(s.score)] || 0) + 1

  console.log(`FIX VERIFIED — impact re-measured:`)
  console.log(`  scan: ${scan.out.split('\n').filter((l) => l.includes('AFFECTED')).join(' | ')}`)
  console.log(`  leaderboard distribution: ${JSON.stringify(dist)}`)
  console.log(`  reports: ${scanFile} / ${boardFile} / ${scoresFile}`)
}

main().catch((e) => { console.error(e); process.exit(1) })