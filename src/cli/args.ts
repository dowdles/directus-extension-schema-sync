export interface CliConfig {
  url: string
  token: string | undefined
  outputDir: string
  ignoreSystemCollections: boolean
  includeSystemCollections: string[]
  ignoreCollections: string[]
  prettyPrint: boolean
}

export function getFlag(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag)
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined
}

export function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag)
}

export function parseCliConfig(args: string[]): CliConfig {
  return {
    url: getFlag(args, '--url') ?? process.env.DIRECTUS_URL ?? 'http://localhost:8055',
    token: getFlag(args, '--token') ?? process.env.DIRECTUS_ACCESS_TOKEN,
    outputDir: getFlag(args, '--output') ?? process.env.SCHEMA_SYNC_OUTPUT_DIR ?? './snapshots/split',
    ignoreSystemCollections:
      !hasFlag(args, '--no-ignore-system') && process.env.SCHEMA_SYNC_IGNORE_SYSTEM !== 'false',
    includeSystemCollections: (
      getFlag(args, '--include-system') ?? process.env.SCHEMA_SYNC_INCLUDE_SYSTEM ?? ''
    ).split(',').filter(Boolean),
    ignoreCollections: (
      getFlag(args, '--ignore') ?? process.env.SCHEMA_SYNC_IGNORE_COLLECTIONS ?? ''
    ).split(',').filter(Boolean),
    prettyPrint:
      !hasFlag(args, '--no-pretty') &&
      (hasFlag(args, '--pretty') || process.env.SCHEMA_SYNC_PRETTY_PRINT !== 'false'),
  }
}
