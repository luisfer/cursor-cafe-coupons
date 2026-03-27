import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import type { CouponConfig } from '../lib/types'
import { generateCouponHTML } from '../lib/generate-html'
import { PRESETS } from '../lib/presets'

const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  cursor-cafe-coupons CLI

  Usage:
    npm run cli -- <config.json> [output.html]
    npm run cli -- --preset classic [output.html]

  Arguments:
    config.json   Path to a JSON config file
    output.html   Output file (default: stdout)

  Flags:
    --preset <name>   Use a built-in preset (classic, minimal, full; presets use print.couponsPerPage "auto")
    --single          Generate a single coupon (default: print mode)
    --list-presets    List available presets
    -h, --help        Show this help
  `)
  process.exit(0)
}

if (args.includes('--list-presets')) {
  console.log('\nAvailable presets:\n')
  for (const [key, { label }] of Object.entries(PRESETS)) {
    console.log(`  ${key.padEnd(12)} ${label}`)
  }
  console.log()
  process.exit(0)
}

let config: CouponConfig

const presetIdx = args.indexOf('--preset')
if (presetIdx !== -1) {
  const presetName = args[presetIdx + 1]
  if (!presetName || !(presetName in PRESETS)) {
    console.error(`Unknown preset: ${presetName}. Use --list-presets to see options.`)
    process.exit(1)
  }
  config = JSON.parse(JSON.stringify(PRESETS[presetName as keyof typeof PRESETS].config))
  args.splice(presetIdx, 2)
} else {
  const configPath = args.find((a) => !a.startsWith('--'))
  if (!configPath) {
    console.error('Provide a config JSON file or use --preset. See --help.')
    process.exit(1)
  }

  const configFile = readFileSync(resolve(configPath), 'utf-8')
  config = JSON.parse(configFile)
  args.splice(args.indexOf(configPath), 1)
}

const mode = args.includes('--single') ? 'single' : 'print'
const html = generateCouponHTML(config, mode as 'single' | 'print')

const outputPath = args.find((a) => !a.startsWith('--'))
if (outputPath) {
  writeFileSync(resolve(outputPath), html, 'utf-8')
  console.log(`Written to ${resolve(outputPath)}`)
} else {
  process.stdout.write(html)
}
