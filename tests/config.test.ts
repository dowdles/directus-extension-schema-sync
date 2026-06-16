import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadConfig, shouldInclude } from '../src/endpoint/config'

describe('loadConfig', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.SCHEMA_SYNC_OUTPUT_DIR
    delete process.env.SCHEMA_SYNC_IGNORE_SYSTEM
    delete process.env.SCHEMA_SYNC_INCLUDE_SYSTEM
    delete process.env.SCHEMA_SYNC_IGNORE_COLLECTIONS
    delete process.env.SCHEMA_SYNC_PRETTY_PRINT
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns defaults when no env vars are set', () => {
    const config = loadConfig()
    expect(config.outputDir).toBe('./snapshots/split')
    expect(config.ignoreSystemCollections).toBe(true)
    expect(config.includeSystemCollections).toEqual([])
    expect(config.ignoreCollections).toEqual([])
    expect(config.prettyPrint).toBe(true)
  })

  it('reads outputDir from SCHEMA_SYNC_OUTPUT_DIR', () => {
    process.env.SCHEMA_SYNC_OUTPUT_DIR = './custom/path'
    expect(loadConfig().outputDir).toBe('./custom/path')
  })

  it('disables ignoreSystemCollections when SCHEMA_SYNC_IGNORE_SYSTEM=false', () => {
    process.env.SCHEMA_SYNC_IGNORE_SYSTEM = 'false'
    expect(loadConfig().ignoreSystemCollections).toBe(false)
  })

  it('parses comma-separated SCHEMA_SYNC_INCLUDE_SYSTEM', () => {
    process.env.SCHEMA_SYNC_INCLUDE_SYSTEM = 'directus_settings,directus_flows'
    expect(loadConfig().includeSystemCollections).toEqual(['directus_settings', 'directus_flows'])
  })

  it('parses comma-separated SCHEMA_SYNC_IGNORE_COLLECTIONS', () => {
    process.env.SCHEMA_SYNC_IGNORE_COLLECTIONS = 'zbr_pages,zbr_content'
    expect(loadConfig().ignoreCollections).toEqual(['zbr_pages', 'zbr_content'])
  })

  it('disables prettyPrint when SCHEMA_SYNC_PRETTY_PRINT=false', () => {
    process.env.SCHEMA_SYNC_PRETTY_PRINT = 'false'
    expect(loadConfig().prettyPrint).toBe(false)
  })
})

describe('shouldInclude', () => {
  const BASE = {
    outputDir: './snapshots/split',
    ignoreCollections: [],
    ignoreSystemCollections: true,
    includeSystemCollections: [],
    prettyPrint: true,
  }

  it('includes regular collections', () => {
    expect(shouldInclude('zbr_pages', BASE)).toBe(true)
  })

  it('excludes collections in ignoreCollections', () => {
    expect(shouldInclude('zbr_pages', { ...BASE, ignoreCollections: ['zbr_pages'] })).toBe(false)
  })

  it('excludes system collections when ignoreSystemCollections is true', () => {
    expect(shouldInclude('directus_activity', BASE)).toBe(false)
  })

  it('includes system collections listed in includeSystemCollections', () => {
    expect(shouldInclude('directus_settings', { ...BASE, includeSystemCollections: ['directus_settings'] })).toBe(true)
  })

  it('ignoreCollections takes precedence over includeSystemCollections', () => {
    expect(shouldInclude('directus_settings', {
      ...BASE,
      ignoreCollections: ['directus_settings'],
      includeSystemCollections: ['directus_settings'],
    })).toBe(false)
  })

  it('includes system collections when ignoreSystemCollections is false', () => {
    expect(shouldInclude('directus_activity', { ...BASE, ignoreSystemCollections: false })).toBe(true)
  })
})
