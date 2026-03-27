#!/usr/bin/env node

const { execFileSync } = require('child_process')
const { join } = require('path')

const script = join(__dirname, 'generate.ts')
const args = process.argv.slice(2)

try {
  execFileSync('node', ['--import', 'tsx', script, ...args], {
    stdio: 'inherit',
    cwd: join(__dirname, '..'),
  })
} catch (err) {
  process.exit(err.status ?? 1)
}
