#!/usr/bin/env node
/**
 * Release watcher: polls npm dist-tags for @deepseek-ai/dsh and generates a
 * compatibility report whenever `latest` or `next` moves. Designed to run on
 * a schedule; commits are handled by the workflow, not this script.
 *
 * Output contract:
 *   CHANGED <version>   — state moved, report written
 *   NO_CHANGE           — nothing to do
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const STATE_PATH = path.join(ROOT, 'docs', 'release-compat', 'state.json')

async function main() {
  const res = await fetch('https://registry.npmjs.org/@deepseek-ai/dsh', {
    headers: { 'user-agent': 'dsh-ecosystem-release-watch' },
  })
  if (!res.ok) throw new Error(`npm registry HTTP ${res.status}`)
  const meta = await res.json()
  const current = {
    latest: meta['dist-tags']?.latest ?? null,
    next: meta['dist-tags']?.next ?? null,
    checkedAt: new Date().toISOString(),
  }

  let previous = null
  if (existsSync(STATE_PATH)) {
    try { previous = JSON.parse(readFileSync(STATE_PATH, 'utf8')) } catch { previous = null }
  }

  const moved = previous === null
    || previous.latest !== current.latest
    || previous.next !== current.next

  if (!moved) {
    console.log('NO_CHANGE')
    return
  }

  const reportPath = path.join(ROOT, 'docs', 'release-compat', `${current.latest}.md`)
  if (!existsSync(reportPath)) {
    const result = spawnSync(process.execPath, ['scripts/release-compat.mjs', '--version', current.latest], {
      cwd: ROOT,
      encoding: 'utf8',
    })
    if (result.status !== 0) {
      console.error(result.stdout || result.stderr)
      throw new Error(`release-compat failed for ${current.latest}`)
    }
    console.log(result.stdout.trim())
  }

  mkdirSync(path.dirname(STATE_PATH), { recursive: true })
  writeFileSync(STATE_PATH, JSON.stringify(current, null, 2) + '\n', 'utf8')
  console.log(`CHANGED ${current.latest}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
