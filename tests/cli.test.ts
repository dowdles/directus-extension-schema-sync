import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { parseCliConfig } from '../src/cli/args'

describe('parseCliConfig', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.DIRECTUS_URL
    delete process.env.DIRECTUS_ACCESS_TOKEN
    delete process.env.SCHEMA_SYNC_OUTPUT_DIR
    delete process.env.SCHEMA_SYNC_IGNORE_SYSTEM
    delete process.env.SCHEMA_SYNC_INCLUDE_SYSTEM
    delete process.env.SCHEMA_SYNC_IGNORE_COLLECTIONS
    delete process.env.SCHEMA_SYNC_PRETTY_PRINT
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns defaults with no flags and no env vars', () => {
    const config = parseCliConfig([])
    expect(config.url).toBe('http://localhost:8055')
    expect(config.token).toBeUndefined()
    expect(config.outputDir).toBe('./snapshots/split')
    expect(config.ignoreSystemCollections).toBe(true)
    expect(config.includeSystemCollections).toEqual([])
    expect(config.ignoreCollections).toEqual([])
    expect(config.prettyPrint).toBe(true)
  })

  it('--url flag overrides DIRECTUS_URL env var', () => {
    process.env.DIRECTUS_URL = 'http://env:8055'
    expect(parseCliConfig(['--url', 'http://flag:8055']).url).toBe('http://flag:8055')
  })

  it('DIRECTUS_URL env var is used when no --url flag', () => {
    process.env.DIRECTUS_URL = 'http://env:8055'
    expect(parseCliConfig([]).url).toBe('http://env:8055')
  })

  it('--token flag overrides DIRECTUS_ACCESS_TOKEN env var', () => {
    process.env.DIRECTUS_ACCESS_TOKEN = 'env-token'
    expect(parseCliConfig(['--token', 'flag-token']).token).toBe('flag-token')
  })

  it('DIRECTUS_ACCESS_TOKEN env var is used when no --token flag', () => {
    process.env.DIRECTUS_ACCESS_TOKEN = 'env-token'
    expect(parseCliConfig([]).token).toBe('env-token')
  })

  it('--output flag overrides SCHEMA_SYNC_OUTPUT_DIR', () => {
    expect(parseCliConfig(['--output', './custom']).outputDir).toBe('./custom')
  })

  it('--no-ignore-system disables ignoreSystemCollections', () => {
    expect(parseCliConfig(['--no-ignore-system']).ignoreSystemCollections).toBe(false)
  })

  it('--include-system parses comma-separated list', () => {
    expect(
      parseCliConfig(['--include-system', 'directus_settings,directus_flows']).includeSystemCollections,
    ).toEqual(['directus_settings', 'directus_flows'])
  })

  it('--ignore parses comma-separated list', () => {
    expect(
      parseCliConfig(['--ignore', 'zbr_pages,zbr_content']).ignoreCollections,
    ).toEqual(['zbr_pages', 'zbr_content'])
  })

  it('--no-pretty disables prettyPrint', () => {
    expect(parseCliConfig(['--no-pretty']).prettyPrint).toBe(false)
  })

  it('SCHEMA_SYNC_IGNORE_SYSTEM=false disables ignoreSystemCollections via env var', () => {
    process.env.SCHEMA_SYNC_IGNORE_SYSTEM = 'false'
    expect(parseCliConfig([]).ignoreSystemCollections).toBe(false)
  })

  it('--no-ignore-system overrides SCHEMA_SYNC_IGNORE_SYSTEM=true', () => {
    process.env.SCHEMA_SYNC_IGNORE_SYSTEM = 'true'
    expect(parseCliConfig(['--no-ignore-system']).ignoreSystemCollections).toBe(false)
  })
})
