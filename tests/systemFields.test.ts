import { describe, it, expect } from 'vitest'
import { splitSnapshot } from '../src/endpoint/export'
import { mergeSnapshots } from '../src/endpoint/import'
import type { DirectusSnapshot, SchemaConfig } from '../src/endpoint/types'

const CONFIG: SchemaConfig = {
  outputDir: './snapshots/split',
  ignoreCollections: [],
  ignoreSystemCollections: true,
  includeSystemCollections: [],
  prettyPrint: false,
}

const systemFields = [
  { collection: 'directus_access', field: 'id' },
  { collection: 'directus_activity', field: 'action' },
]

function baseSnapshot(): DirectusSnapshot {
  return {
    version: 1,
    directus: '11.17.1',
    vendor: 'mysql',
    collections: [{ collection: 'articles' }],
    fields: [{ collection: 'articles', field: 'title' }],
    systemFields,
    relations: [],
  }
}

describe('splitSnapshot systemFields', () => {
  it('preserves systemFields in meta', () => {
    const { meta } = splitSnapshot(baseSnapshot(), CONFIG)
    expect(meta.systemFields).toEqual(systemFields)
  })

  it('omits systemFields from meta when absent in snapshot', () => {
    const snapshot = baseSnapshot()
    delete snapshot.systemFields
    const { meta } = splitSnapshot(snapshot, CONFIG)
    expect(meta.systemFields).toBeUndefined()
  })
})

describe('mergeSnapshots systemFields', () => {
  it('includes systemFields from meta in the merged snapshot', () => {
    const meta = { version: 1, directus: '11.17.1', vendor: 'mysql', systemFields }
    const merged = mergeSnapshots(meta, [])
    expect(merged.systemFields).toEqual(systemFields)
  })

  it('omits systemFields when meta has none', () => {
    const meta = { version: 1, directus: '11.17.1', vendor: 'mysql' }
    const merged = mergeSnapshots(meta, [])
    expect('systemFields' in merged).toBe(false)
  })
})
