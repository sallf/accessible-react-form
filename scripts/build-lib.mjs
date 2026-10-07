import { URL } from 'node:url'
import { createRequire } from 'node:module'
import { rm, readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

// A changed output filename must not leave an obsolete entry in the tarball.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true })
const require = createRequire(import.meta.url)
const result = spawnSync(
  process.execPath,
  [require.resolve('rollup/dist/bin/rollup'), '-c'],
  { stdio: 'inherit' }
)
if (result.status !== 0) process.exit(result.status ?? 1)
const barrel = await readFile(
  new URL('../dist/types/index.d.ts', import.meta.url),
  'utf8'
)
await writeFile(
  new URL('../dist/types/index.d.mts', import.meta.url),
  barrel.replace(/(from ['"])(\.[^'"]+)(['"])/g, '$1$2.js$3')
)
