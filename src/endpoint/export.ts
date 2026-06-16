import { shouldInclude } from './config.js'
import type { SchemaConfig, CollectionSnapshot, SnapshotMeta, DirectusSnapshot } from './types.js'

export function splitSnapshot(
  snapshot: DirectusSnapshot,
  config: SchemaConfig,
): { meta: SnapshotMeta; collections: Map<string, CollectionSnapshot> } {
  const { version, directus, vendor, collections, fields, relations } = snapshot

  const result = new Map<string, CollectionSnapshot>()

  for (const collection of collections) {
    const name = collection['collection'] as string
    if (!shouldInclude(name, config)) continue
    result.set(name, {
      collection,
      fields: fields.filter((f) => f['collection'] === name),
      relations: relations.filter((r) => r['collection'] === name),
    })
  }

  return { meta: { version, directus, vendor }, collections: result }
}
