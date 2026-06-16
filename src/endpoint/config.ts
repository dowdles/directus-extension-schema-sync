import type { SchemaConfig } from './types.js'

export function loadConfig(): SchemaConfig {
  return {
    outputDir: process.env.SCHEMA_SYNC_OUTPUT_DIR ?? './snapshots/split',
    ignoreCollections: (process.env.SCHEMA_SYNC_IGNORE_COLLECTIONS ?? '').split(',').filter(Boolean),
    ignoreSystemCollections: process.env.SCHEMA_SYNC_IGNORE_SYSTEM !== 'false',
    includeSystemCollections: (process.env.SCHEMA_SYNC_INCLUDE_SYSTEM ?? '').split(',').filter(Boolean),
    prettyPrint: process.env.SCHEMA_SYNC_PRETTY_PRINT !== 'false',
  }
}

export function shouldInclude(collectionName: string, config: SchemaConfig): boolean {
  if (config.ignoreCollections.includes(collectionName)) return false
  if (collectionName.startsWith('directus_')) {
    if (config.ignoreSystemCollections) {
      return config.includeSystemCollections.includes(collectionName)
    }
  }
  return true
}
