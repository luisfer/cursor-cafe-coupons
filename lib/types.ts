export interface MenuItem {
  name: string
  /** Section heading row (no drink checkboxes). Use `temps: []` when kind is `section`. */
  kind?: 'section'
  temps: ('hot' | 'iced')[]
}

export interface CouponConfig {
  venue: {
    name: string
    logo: string
    logoHeight: number
    wifi: string
  }
  event: {
    date: string
  }
  menu: MenuItem[]
  options: {
    /** Optional bean/roast choices (same checkbox UI as milks). */
    beanChoices: string[]
    milkChoices: string[]
    footerNote: string
    /** Short tagline (e.g. "Happy building!"). Shown on a branded footer bar. Omit or empty string hides it. */
    motto?: string
    /** Heading above the drink list (default: choose-your-drink copy). */
    menuTitle?: string
    showCouponNumber: boolean
  }
  print: {
    /** Use `"auto"` to pick 3, 6, or 9 per page from menu complexity (landscape 3-column grid). */
    couponsPerPage: number | 'auto'
    /** @deprecated Print layout is always landscape; kept for older JSON configs. */
    orientation?: 'portrait' | 'landscape'
  }
  theme: {
    headerBg: string
    headerText: string
  }
}
