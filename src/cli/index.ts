import { existsSync, readFileSync } from 'fs'
import { getFlag, parseCliConfig } from './args.js'

function loadEnvFile(path: string): void {
  if (!existsSync(path)) return
  const content = readFileSync(path, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

const argv = process.argv.slice(2)
const command = argv[0]
const args = argv.slice(1)

const envFile = getFlag(args, '--env-file')
if (envFile) loadEnvFile(envFile)

const config = parseCliConfig(args)

if (!config.token) {
  console.error('Error: DIRECTUS_ACCESS_TOKEN is required (--token or DIRECTUS_ACCESS_TOKEN env var)')
  process.exit(1)
}

if (command === 'export') {
  const res = await fetch(`${config.url}/schema-sync/export`, {
    headers: { Authorization: `Bearer ${config.token}` },
  })
  const data = await res.json() as { exported?: number; outputDir?: string; error?: string }
  if (!res.ok) {
    console.error('Export failed:', data.error ?? res.statusText)
    process.exit(1)
  }
  console.log(`Exported ${data.exported} collections to ${data.outputDir}`)
} else if (command === 'import') {
  const res = await fetch(`${config.url}/schema-sync/import`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}` },
  })
  const data = await res.json() as {
    applied?: boolean
    collections?: number
    message?: string
    error?: string
  }
  if (!res.ok) {
    console.error('Import failed:', data.error ?? res.statusText)
    process.exit(1)
  }
  if (data.applied) {
    console.log(`Schema imported: ${data.collections} collections applied`)
  } else {
    console.log('No changes detected, schema is up to date')
  }
} else {
  console.error(`Unknown command: ${command ?? '(none)'}`)
  console.error('Usage: schema-sync export|import [options]')
  process.exit(1)
}
