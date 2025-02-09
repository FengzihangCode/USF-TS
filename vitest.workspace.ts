import { readdirSync, statSync } from 'node:fs'
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace(
  readdirSync('./packages')
    .map(pkg => `packages/${pkg}`)
    .filter(dirPath => statSync(dirPath).isDirectory()),
)
