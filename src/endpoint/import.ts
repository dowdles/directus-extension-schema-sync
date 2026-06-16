import type { CollectionSnapshot, DirectusSnapshot, SnapshotMeta } from './types.js'

export function mergeSnapshots(
  meta: SnapshotMeta,
  collections: CollectionSnapshot[],
): DirectusSnapshot {
  return {
    version: meta.version,
    directus: meta.directus,
    vendor: meta.vendor,
    collections: collections.map((c) => c.collection),
    fields: collections.flatMap((c) => c.fields),
    relations: collections.flatMap((c) => c.relations),
  }
}
