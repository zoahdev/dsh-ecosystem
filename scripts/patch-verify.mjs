#!/usr/bin/env node
/**
 * Patch fleet auto-verifier.
 *
 * Watches deepseek-ai/deepseek-harness master. Whenever the commit moves,
 * re-verifies all ten zoahdev patch branches against the new master:
 *   1. `git apply --check` for every patch (clean application)
 *   2. (optional --run-tests) vitest over the affected packages
 *   3. writes docs/patch-verify/<master-sha>.md + updates state
 *
 * Output contract:
 *   NO_CHANGE            master unchanged
 *   CHANGED <sha>        master moved, verification ran, report written
 *   MASTER_CHANGED <sha> master moved but no checkout provided
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const STATE_PATH = path.join(ROOT, 'docs', 'patch-verify', 'state.json')
const OUT_DIR = path.join(ROOT, 'docs', 'patch-verify')

const BRANCHES = [
  'fix/tool-runtime-scheduler-symbol-for',
  'fix/profile-manifest-bom-strip',
  'fix/terminal-bash-win32-shell',
  'fix/llm-deepseek-reasoning-low',
  'fix/markdown-single-tilde',
  'fix/session-persistence-recreate-on-enoent',
  'fix/web-crypto-randomuuid-insecure-context',
  'fix/compaction-inherit-header-config',
  'fix/skill-filesystem-eloop-contained',
  'fix/subprocess-spill-recreate-on-enoent',
]

const TEST_DIRS = [
  'packages/core/tools/tests',
  'packages/boot/app-boot/tests',
  'packages/terminal/terminal-bash/tests',
  'packages/llm/llm-deepseek/tests',
  'packages/client/ui-primitives/tests',
  'packages/session/session-persistence-jsonl/tests',
  'packages/util/random-uuid/tests',
  'packages/compaction/compaction-basic/tests',
  'packages/skill/skill-filesystem/tests',
]

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--repo-dir') { args.repoDir = argv[i + 1]; i += 1 }
    if (argv[i] === '--run-tests') args.runTests = true
    if (argv[i] === '--force') args.force = true
  }
  return args
}

function run(cmd, args, cwd, shell = false) {
  return spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: 900_000, maxBuffer: 64 * 1024 * 1024, shell })
}

async function masterSha() {
  const res = await fetch('https://api.github.com/repos/deepseek-ai/deepseek-harness/commits/master?per_page=1', {
    headers: { 'user-agent': 'dsh-ecosystem-patch-verify' },
  })
  if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data[0].sha : data.sha
}

function readState() {
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'))
  } catch {
    return { lastMasterSha: null }
  }
}

async function main() {
  const { repoDir, runTests, force } = parseArgs(process.argv.slice(2))
  const sha = await masterSha()
  const state = readState()
  if (state.lastMasterSha === sha && !force) {
    console.log('NO_CHANGE')
    return
  }
  if (!repoDir || !existsSync(path.join(repoDir, '.git'))) {
    console.log(`MASTER_CHANGED ${sha}`)
    return
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const reportPath = path.join(OUT_DIR, `${sha}.md`)
  const lines = []
  lines.push(`# Patch fleet verification — master ${sha.slice(0, 10)}`)
  lines.push('')
  lines.push(`> Generated ${new Date().toISOString()} by [dsh-ecosystem](https://github.com/zoahdev/dsh-ecosystem)`)
  lines.push('')

  run('git', ['fetch', '--depth', '1', 'origin', `master:refs/remotes/origin/master`], repoDir)
  let allClean = true
  for (const branch of BRANCHES) {
    const spec = `${branch}:refs/remotes/fork/${branch}`
    const fetch = run('git', ['fetch', '--depth', '1', 'https://github.com/zoahdev/deepseek-harness.git', spec], repoDir)
    if (fetch.status !== 0) {
      allClean = false
      lines.push(`| ${branch} | fetch failed | ❌ |`)
      continue
    }
    const name = branch.replace('fix/', '')
    const patch = run('git', ['diff', 'origin/master', `refs/remotes/fork/${branch}`], repoDir)
    writeFileSync(path.join(OUT_DIR, `${name}.patch`), patch.stdout)
    const check = run('git', ['apply', '--check', path.join(OUT_DIR, `${name}.patch`)], repoDir)
    const ok = check.status === 0
    if (!ok) allClean = false
    lines.push(`| ${branch} | apply-check ${ok ? '✅' : '❌'} | ${ok ? 'clean' : (check.stderr || 'failed').slice(0, 120)} |`)
  }

  if (runTests) {
    const test = run('pnpm', ['exec', 'vitest', 'run', ...TEST_DIRS], repoDir, process.platform === 'win32')
    const output = `${test.stdout ?? ''}${test.stderr ?? ''}`
    const ok = test.status === 0
    if (!ok) allClean = false
    lines.push('')
    lines.push(`| Vitest (5 affected packages) | exit ${test.status} | ${ok ? '✅' : '❌'} |`)
    lines.push('')
    lines.push(`\`\`\`text\n${output.slice(-600)}\n\`\`\``)
  }

  lines.push('', `Overall: **${allClean ? 'ALL CLEAN' : 'ISSUES FOUND'}**`)
  writeFileSync(reportPath, lines.join('\n') + '\n', 'utf8')
  writeFileSync(STATE_PATH, JSON.stringify({ lastMasterSha: sha, lastVerifiedAt: new Date().toISOString() }, null, 2) + '\n', 'utf8')
  console.log(`CHANGED ${sha}`)
  process.exit(allClean ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
