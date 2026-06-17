# directus-extension-schema-split

Export and import Directus schema snapshots split by collection — one JSON file per collection instead of a single monolithic snapshot. Easier to review in version control.

## Installation

```sh
pnpm add directus-extension-schema-split
```

Restart Directus after installation.

## Endpoints

The extension registers two HTTP endpoints. Both require an admin token.

### Export

```
GET /schema-sync/export
Authorization: Bearer <token>
```

Reads the current schema, splits it by collection, and writes JSON files to the configured output directory.

**Response:**
```json
{ "exported": 12, "outputDir": "/directus/snapshots/split" }
```

### Import

```
POST /schema-sync/import
Authorization: Bearer <token>
```

Reads the JSON files from the configured output directory, merges them into a snapshot, and applies it to Directus.

**Response:**
```json
{ "applied": true, "collections": 12 }
// or
{ "applied": false, "message": "No changes detected" }
```

## Configuration

Configure via environment variables in your Directus container:

| Variable | Default | Description |
|---|---|---|
| `SCHEMA_SYNC_OUTPUT_DIR` | `./snapshots/split` | Output directory for split snapshot files |
| `SCHEMA_SYNC_IGNORE_SYSTEM` | `true` | Ignore system collections (`directus_*`) |
| `SCHEMA_SYNC_INCLUDE_SYSTEM` | `""` | Comma-separated system collections to include despite `IGNORE_SYSTEM` |
| `SCHEMA_SYNC_IGNORE_COLLECTIONS` | `""` | Comma-separated collection names to exclude |
| `SCHEMA_SYNC_PRETTY_PRINT` | `true` | Pretty-print JSON output |

## CLI

The package ships a `schema-sync` CLI for triggering export/import from outside the container (e.g., CI/CD pipelines).

```sh
schema-sync export [options]
schema-sync import [options]

Options:
  --url <url>              Directus URL
                           Env: DIRECTUS_URL (default: http://localhost:8055)
  --token <token>          Admin access token (required)
                           Env: DIRECTUS_ACCESS_TOKEN
  --output <dir>           Output directory
                           Env: SCHEMA_SYNC_OUTPUT_DIR
  --no-ignore-system       Include system collections
  --include-system <list>  Comma-separated system collections to include
  --ignore <list>          Comma-separated collections to ignore
  --no-pretty              Compact JSON output
  --env-file <path>        Load environment variables from file
```

Example with a `.env` file:

```sh
schema-sync export --env-file .env
schema-sync import --env-file .env
```

## License

MIT
