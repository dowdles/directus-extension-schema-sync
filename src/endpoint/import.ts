import type { CollectionSnapshot, DirectusSnapshot, SnapshotMeta } from './types.js'

export function mergeSnapshots(
  meta: SnapshotMeta,
  collections: CollectionSnapshot[],
): DirectusSnapshot {
  const snapshot: DirectusSnapshot = {
    version: meta.version,
    directus: meta.directus,
    vendor: meta.vendor,
    collections: collections.map((c) => c.collection),
    fields: collections.flatMap((c) => c.fields),
    relations: collections.flatMap((c) => c.relations),
  }
  if (meta.systemFields !== undefined) snapshot.systemFields = meta.systemFields
  return snapshot
}
