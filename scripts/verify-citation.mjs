#!/usr/bin/env node
/**
 * verify-citation.mjs — check a `file:line` citation against a local checkout
 * before posting it in a discussion. Enforces the evidence-grade rule: never
 * cite a line you have not read.
 *
 * Usage:
 *   node scripts/verify-citation.mjs <repo> <file:line> [--sha <expected-head>]
 *
 * Examples:
 *   node scripts/verify-citation.mjs ../deepseek-harness-src packages/core/session/src/index.ts:266
 *   node scripts/verify-citation.mjs ../deepseek-harness-src packages/core/session/src/index.ts:266 --sha 99f6f02
 *
 * Exit 0 when the citation resolves; 1 otherwise.
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = process.argv[2]
const citation = process.argv[3]
const shaArg = process.argv.find((a) => a.startsWith('--sha='))?.slice('--sha='.length)
if (!repo || !citation) {
  console.error('usage: node scripts/verify-citation.mjs <repo> <file:line> [--sha <expected-head>]')
  process.exit(2)
}
const m = /^(.+?):(\d+)$/.exec(citation)
if (!m) { console.error(`bad citation "${citation}" — expected file:line`); process.exit(2) }
const file = m[1]
const line = Number(m[2])
const abs = resolve(repo, file)

if (!existsSync(abs)) {
  console.error(`✗ ${file} — file not found under ${repo}`)
  process.exit(1)
}
const lines = readFileSync(abs, 'utf8').split(/\r?\n/)
if (line < 1 || line > lines.length) {
  console.error(`✗ ${file}:${line} — line out of range (file has ${lines.length} lines)`)
  process.exit(1)
}
console.log(`✓ ${file}:${line}`)
console.log(`  ${lines[line - 1].trim()}`)

if (shaArg) {
  const r = spawnSync('git', ['-C', repo, 'log', '-1', '--format=%H'], { encoding: 'utf8' })
  const head = r.stdout?.trim() ?? ''
  if (head && !head.startsWith(shaArg)) {
    console.warn(`  ⚠ local HEAD ${head.slice(0, 8)} ≠ expected ${shaArg.slice(0, 8)} — cite the SHA you actually verified`)
  } else if (head) {
    console.log(`  ✓ HEAD matches ${shaArg.slice(0, 8)}`)
  }
}