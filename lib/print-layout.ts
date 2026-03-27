import type { CouponConfig } from './types'

function resolveMotto(raw: string | undefined): string {
  if (raw === '') return ''
  if (raw === undefined || raw === null) return 'Happy building!'
  return raw.trim()
}

/** Rough content height (mm) for auto grid selection. */
export function estimateContentMm(config: CouponConfig): number {
  const drinks = config.menu.filter((m) => m.kind !== 'section').length
  const sections = config.menu.filter((m) => m.kind === 'section').length
  const header = 10
  const heading = 4
  const drinkRow = 4
  const sectionRow = 4
  const wifi = config.venue.wifi ? 4 : 0
  const beans = (config.options.beanChoices ?? []).length ? 5 : 0
  const milks = config.options.milkChoices.length ? 5 : 0
  const footer = config.options.footerNote?.trim() ? 4 : 0
  const brand = resolveMotto(config.options.motto) ? 5 : 0

  return (
    header +
    heading +
    drinks * drinkRow +
    sections * sectionRow +
    wifi +
    beans +
    milks +
    footer +
    brand
  )
}

const BREATHING = 1.15

/** Pick 9, 6, or 3 coupons per landscape A4 (3 columns × 1–3 rows). */
export function autoGrid(config: CouponConfig): number {
  const contentMm = estimateContentMm(config)
  if (contentMm * BREATHING <= 70) return 9
  if (contentMm * BREATHING <= 105) return 6
  return 3
}

/** Resolved integer count for print layout and UI hints. */
export function resolveCouponsPerPage(config: CouponConfig): number {
  if (config.print.couponsPerPage === 'auto') {
    return autoGrid(config)
  }
  return config.print.couponsPerPage
}
