import type { CouponConfig, MenuItem } from './types'
import { resolveCouponsPerPage } from './print-layout'

const CURSOR_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="400 395 800 190" height="190" width="800"><g clip-path="url(#c)"><path fill="#EDECEC" d="M563.463 439.971L487.344 396.057C484.899 394.646 481.883 394.646 479.439 396.057L403.323 439.971C401.269 441.156 400 443.349 400 445.723V534.276C400 536.647 401.269 538.843 403.323 540.029L479.443 583.943C481.887 585.353 484.903 585.353 487.347 583.943L563.466 540.029C565.521 538.843 566.79 536.651 566.79 534.276V445.723C566.79 443.352 565.521 441.156 563.466 439.971H563.463ZM558.681 449.273L485.199 576.451C484.703 577.308 483.391 576.958 483.391 575.966V492.691C483.391 491.027 482.501 489.488 481.058 488.652L408.887 447.016C408.03 446.52 408.38 445.209 409.373 445.209H556.337C558.424 445.209 559.728 447.47 558.685 449.276H558.681V449.273Z"/><path fill="#EDECEC" d="M658.165 444.306H690.555V462.135H659.262C642.381 462.135 629.205 471.872 629.205 492.444C629.205 513.015 642.381 522.753 659.262 522.753H690.555V540.582H656.793C628.519 540.582 608.482 523.989 608.482 492.448C608.482 460.906 629.891 444.313 658.165 444.313V444.306Z"/><path fill="#EDECEC" d="M707.025 444.306H727.062V503.139C727.062 517.811 733.787 524.671 749.572 524.671C765.356 524.671 772.081 517.815 772.081 503.139V444.306H792.118V507.252C792.118 528.645 778.531 542.225 749.572 542.225C720.612 542.225 707.025 528.509 707.025 507.116V444.306Z"/><path fill="#EDECEC" d="M896.832 471.594C896.832 482.292 890.657 490.519 882.42 494.087V494.361C891.068 495.597 895.46 501.767 895.596 510.134L896.007 540.579H875.97L875.559 513.426C875.423 507.391 871.853 503.688 864.717 503.688H831.366V540.579H811.329V444.306H866.64C884.757 444.306 896.832 453.493 896.832 471.597V471.594ZM876.656 474.34C876.656 466.113 872.264 461.585 864.031 461.585H831.366V487.091H864.303C871.85 487.091 876.656 482.567 876.656 474.336V474.34Z"/><path fill="#EDECEC" d="M972.587 512.462C972.587 505.606 968.195 502.724 961.609 502.178L939.374 500.121C920.16 498.34 910.14 490.794 910.14 472.555C910.14 454.315 922.493 444.302 940.196 444.302H989.328V461.581H941.569C934.707 461.581 930.316 465.149 930.316 472.005C930.316 478.861 934.843 482.153 941.708 482.703L964.353 484.624C981.51 486.131 992.763 493.951 992.763 512.326C992.763 530.702 980.824 540.579 963.942 540.579H912.612V523.3H962.02C968.47 523.3 972.587 518.911 972.587 512.466V512.462Z"/><path fill="#EDECEC" d="M1051.37 442.66C1081.56 442.66 1100.64 461.996 1100.64 492.305C1100.64 522.614 1080.74 542.225 1050.55 542.225C1020.35 542.225 1001.27 522.614 1001.27 492.305C1001.27 461.996 1021.18 442.66 1051.37 442.66ZM1079.91 492.441C1079.91 472.144 1068.11 460.214 1050.95 460.214C1033.8 460.214 1021.99 472.144 1021.99 492.441C1021.99 512.737 1033.8 524.667 1050.95 524.667C1068.11 524.667 1079.91 512.737 1079.91 492.441Z"/><path fill="#EDECEC" d="M1200 471.594C1200 482.292 1193.83 490.519 1185.59 494.087V494.361C1194.24 495.597 1198.63 501.767 1198.76 510.134L1199.17 540.579H1179.14L1178.73 513.426C1178.59 507.391 1175.02 503.688 1167.89 503.688H1134.53V540.579H1114.5V444.306H1169.81C1187.93 444.306 1200 453.493 1200 471.597V471.594ZM1179.82 474.34C1179.82 466.113 1175.43 461.585 1167.2 461.585H1134.53V487.091H1167.47C1175.02 487.091 1179.82 482.567 1179.82 474.336V474.34Z"/></g><defs><clipPath id="c"><rect transform="translate(400 395)" fill="white" height="190" width="800"/></clipPath></defs></svg>`

function getCursorLogoDataURL(): string {
  if (typeof btoa === 'function') {
    return `data:image/svg+xml;base64,${btoa(CURSOR_LOGO_SVG)}`
  }
  return `data:image/svg+xml;base64,${Buffer.from(CURSOR_LOGO_SVG).toString('base64')}`
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Resolve motto: omit/undefined → default; empty string → hide */
function resolveMotto(raw: string | undefined): string {
  if (raw === '') return ''
  if (raw === undefined || raw === null) return 'Happy building!'
  return raw.trim()
}

function buildDrinkRow(item: MenuItem): string {
  let tempHTML: string

  if (item.temps.length === 1) {
    tempHTML = `<span class="temp-single">${item.temps[0]}</span>`
  } else {
    const options = item.temps
      .map((t) => `<span class="temp-option"><span class="cb sm"></span> ${t}</span>`)
      .join('')
    tempHTML = `<div class="temp-group">${options}</div>`
  }

  return `<div class="drink-row"><span class="cb"></span><span class="drink-name">${escapeHTML(item.name)}</span>${tempHTML}</div>`
}

function buildMenuRow(item: MenuItem): string {
  if (item.kind === 'section') {
    return `<div class="section-row">${escapeHTML(item.name)}</div>`
  }
  return buildDrinkRow(item)
}

function buildChoiceBlock(label: string, choices: string[]): string {
  if (!choices.length) return ''
  const opts = choices
    .map((c) => `<div class="milk-option"><span class="cb"></span> ${escapeHTML(c)}</div>`)
    .join('')
  return `<div class="choice-block"><div class="choice-label">${escapeHTML(label)}</div><div class="milk-options">${opts}</div></div>`
}

/**
 * Continuous scale helper. All print dimensions derive from a single scale
 * factor computed from the cell height relative to a reference "full-size"
 * coupon. Menu density nudges drink-row spacing so a short menu breathes
 * and a long menu compresses.
 */
function printScale(
  cellHeightMm: number,
  menuItems: number,
) {
  const REF_HEIGHT = 210
  const k = cellHeightMm / REF_HEIGHT

  const densityItems = Math.max(menuItems, 1)
  const REF_ITEMS = 6
  const densityK = Math.sqrt(REF_ITEMS / densityItems)

  const s  = (base: number, min: number) => Math.max(min, Math.round(base * k))
  const sd = (base: number, min: number) => Math.max(min, Math.round(base * k * densityK))
  const fk = Math.sqrt(k)
  const sf = (base: number, min: number) => Math.max(min, Math.round(base * fk))
  const px = (n: number) => `${n}px`

  return {
    headerPadV:    px(s(16, 4)),
    headerPadH:    px(s(22, 6)),
    headerGapV:    px(s(2, 1)),
    headerGapH:    px(s(6, 3)),
    headerRightGap: px(s(36, 14)),
    logoH:         px(s(26, 10)),
    venueLogoH:    px(s(72, 24)),
    dateFs:        px(sf(15, 8)),
    numFs:         px(sf(14, 8)),
    numBoxW:       px(s(52, 20)),
    numBoxH:       px(s(24, 12)),
    bodyPadT:      px(s(18, 3)),
    bodyPadH:      px(s(22, 6)),
    headingFs:     px(sf(13, 8)),
    headingMb:     px(s(12, 2)),
    secFs:         px(sf(14, 9)),
    secPadT:       px(sd(10, 2)),
    secPadB:       px(sd(6, 1)),
    drinkPad:      px(sd(6, 1)),
    drinkFs:       px(sf(16, 10)),
    drinkMl:       px(s(12, 3)),
    cbW:           px(s(18, 9)),
    cbSmW:         px(s(15, 8)),
    tempGap:       px(s(16, 3)),
    tempFs:        px(sf(15, 9)),
    tempOptionGap: px(s(5, 2)),
    botPadV:       px(s(14, 2)),
    botPadH:       px(s(22, 6)),
    botGap:        px(s(6, 1)),
    choiceFs:      px(sf(13, 8)),
    choiceMb:      px(s(6, 2)),
    milkGap:       px(s(14, 4)),
    milkFs:        px(sf(15, 9)),
    milkCbW:       px(s(18, 9)),
    wifiFs:        px(s(15, 8)),
    footFs:        px(s(15, 7)),
    brandPadV:     px(s(11, 2)),
    brandPadH:     px(s(22, 6)),
    brandFs:       px(s(14, 7)),
    borderW:       k > 0.5 ? '2px' : k > 0.3 ? '1.5px' : '1px',
    borderR:       k > 0.5 ? '4px' : '2px',
    borderSmR:     k > 0.5 ? '3px' : '2px',
  }
}

function buildPrintOverrides(p: ReturnType<typeof printScale>): string {
  return `
    .coupon .header-band{flex-wrap:wrap;padding:${p.headerPadV} ${p.headerPadH};min-height:auto;gap:${p.headerGapV} ${p.headerGapH}}
    .coupon .logos{gap:${p.headerGapH};flex:1;min-width:0}
    .coupon .logos img{height:${p.logoH} !important;width:auto}
    .coupon .logos img.venue-logo{max-height:${p.venueLogoH} !important;object-fit:contain}
    .coupon .header-right{gap:${p.headerRightGap}}
    .coupon .date{font-size:${p.dateFs}}
    .coupon .coupon-number{font-size:${p.numFs}}
    .coupon .number-box{width:${p.numBoxW};height:${p.numBoxH}}
    .coupon .body{padding:${p.bodyPadT} ${p.bodyPadH} 1px;overflow:hidden;flex:1;min-height:0}
    .coupon .drinks-heading{font-size:${p.headingFs};margin-bottom:${p.headingMb};letter-spacing:.12em}
    .coupon .drink-list{gap:0}
    .coupon .section-row{font-size:${p.secFs};padding:${p.secPadT} 0 ${p.secPadB};margin-top:2px;letter-spacing:.1em}
    .coupon .section-row:first-child{margin-top:0;padding-top:0}
    .coupon .drink-row{padding:${p.drinkPad} 0}
    .coupon .drink-name{min-width:0;font-size:${p.drinkFs};margin-left:${p.drinkMl}}
    .coupon .cb{width:${p.cbW};height:${p.cbW};border-radius:${p.borderR};border-width:${p.borderW}}
    .coupon .cb.sm{width:${p.cbSmW};height:${p.cbSmW};border-radius:${p.borderSmR};border-width:${p.borderW}}
    .coupon .temp-group{gap:${p.tempGap};margin-left:auto}
    .coupon .temp-option{font-size:${p.tempFs};gap:${p.tempOptionGap}}
    .coupon .temp-single{font-size:${p.tempFs}}
    .coupon .bottom{padding:${p.botPadV} ${p.botPadH};gap:${p.botGap}}
    .coupon .choices-row{gap:${p.milkGap}}
    .coupon .choice-label{font-size:${p.choiceFs};margin-bottom:${p.choiceMb}}
    .coupon .milk-options{gap:${p.milkGap}}
    .coupon .milk-option{font-size:${p.milkFs};gap:${p.tempOptionGap}}
    .coupon .milk-option .cb{width:${p.milkCbW};height:${p.milkCbW};border-width:${p.borderW}}
    .coupon .bottom-meta{gap:${p.botGap} ${p.milkGap}}
    .coupon .wifi{font-size:${p.wifiFs}}
    .coupon .footer-note{font-size:${p.footFs}}
    .coupon .brand-footer{padding:${p.brandPadV} ${p.brandPadH};font-size:${p.brandFs}}
  `
}

function buildCSS(config: CouponConfig, mode: 'single' | 'print'): string {
  const { theme } = config

  const base = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#faf9f7;color:#1a1814;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;justify-content:center;padding:24px 0}
    .coupon{width:480px;border:2px solid #14120b;background:#fff;display:flex;flex-direction:column;overflow:hidden;border-radius:2px}
    .header-band{background:${theme.headerBg};color:${theme.headerText};padding:16px 22px;display:flex;align-items:center;justify-content:space-between;min-height:52px}
    .logos{display:flex;align-items:center;gap:16px}
    .logos img{height:26px;width:auto;display:block}
    .logos img.venue-logo{height:var(--venue-logo-h,42px);object-fit:contain}
    .date{font-size:15px;font-weight:600;letter-spacing:.06em;color:${theme.headerText}}
    .header-right{display:flex;align-items:center;gap:32px}
    .coupon-number{display:flex;align-items:center;gap:6px;font-size:14px;font-weight:500;color:rgba(237,236,236,.65)}
    .number-box{width:52px;height:24px;border:1.5px solid rgba(237,236,236,.35);background:#fff;border-radius:4px}
    .body{padding:18px 22px 4px;flex:1;display:flex;flex-direction:column}
    .drinks-heading{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.14em;color:#6b6560;margin-bottom:12px}
    .drink-list{display:flex;flex-direction:column;flex:1}
    .section-row{padding:10px 0 6px;margin-top:4px;font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#14120b;border-bottom:1px solid #14120b}
    .section-row:first-child{margin-top:0;padding-top:0}
    .drink-row{display:flex;align-items:center;padding:7px 0;border-bottom:1px solid #e8e4dc}
    .drink-row:last-child{border-bottom:none}
    .cb{width:18px;height:18px;border:1.5px solid #14120b;border-radius:4px;flex-shrink:0}
    .cb.sm{width:15px;height:15px;border-radius:3px}
    .drink-name{min-width:140px;font-size:16px;font-weight:600;margin-left:12px;letter-spacing:-.02em;color:#14120b}
    .temp-group{display:flex;align-items:center;gap:16px;margin-left:auto}
    .temp-option{display:flex;align-items:center;gap:5px;font-size:15px;font-weight:500;color:#3d3a36}
    .temp-single{font-size:15px;font-weight:500;color:#3d3a36;font-style:italic;margin-left:auto}
    .bottom{margin-top:auto;border-top:1px solid #e8e4dc;padding:14px 22px 16px;display:flex;flex-direction:column;gap:10px}
    .bottom-row{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px}
    .choices-row{display:flex;gap:24px;flex-wrap:wrap}
    .choice-block{flex:1;min-width:0}
    .choice-label{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b6560;margin-bottom:6px}
    .milk-options{display:flex;align-items:center;flex-wrap:wrap;gap:14px}
    .milk-option{display:flex;align-items:center;gap:5px;font-size:15px;font-weight:500;color:#3d3a36}
    .milk-option .cb{width:18px;height:18px;border-width:1.5px}
    .bottom-meta{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:12px 32px;margin-top:4px;padding-top:2px}
    .wifi{font-size:15px;color:#3d3a36;font-weight:500}
    .wifi strong{font-weight:700;color:#14120b}
    .footer-note{font-size:15px;color:#5c5750;font-weight:500;letter-spacing:.02em;line-height:1.35}
    .brand-footer{padding:11px 22px;text-align:center;font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;background:${theme.headerBg};color:${theme.headerText};-webkit-print-color-adjust:exact;print-color-adjust:exact}
  `

  if (mode === 'print') {
    const perPage = resolveCouponsPerPage(config)
    const menuItems = config.menu.filter((m) => m.kind !== 'section').length
    const isPortrait = config.print.orientation === 'portrait'
    const menuCols = config.print.menuColumns ?? 1

    if (isPortrait) {
      const rows = perPage
      const cellH = 297 / rows
      const p = printScale(cellH * (menuCols > 1 ? 1.6 : 1), menuItems)

      const menuColsCSS = menuCols > 1 ? `
      .coupon .drink-list{display:block !important;flex:none !important;column-count:${menuCols};column-gap:28px}
      .coupon .drink-row{break-inside:avoid;display:flex}
      .coupon .section-row{break-inside:avoid;break-after:avoid}
      .coupon .drink-row:last-child{border-bottom:1px solid #e8e4dc}
      ` : ''

      return `<style>${base}
        @page{size:A4 portrait;margin:0}
        body{background:#f5f5f5;padding:20px;display:block}
        .print-grid{width:210mm;height:297mm;margin:0 auto;display:flex;flex-direction:column}
        .grid-row{display:flex;flex-direction:row;align-items:stretch;flex:1;min-height:0}
        .grid-row .coupon{flex:1;min-width:0;height:100%;border:2px solid #14120b;border-radius:0;overflow:hidden;display:flex;flex-direction:column}
        .cut-h{height:0;flex-shrink:0;position:relative}
        .cut-h::after{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px dashed #ccc}
        .print-hint{text-align:center;font-size:14px;color:#666;margin-bottom:16px;font-family:'DM Sans',sans-serif}
        ${buildPrintOverrides(p)}
        ${menuColsCSS}
        @media print{
          body{background:#fff;padding:0;margin:0}
          .print-hint{display:none}
          .print-grid{width:210mm;height:297mm}
        }
      </style>`
    }

    const rows = Math.ceil(perPage / 3)
    const cellH = 210 / rows
    const p = printScale(cellH, menuItems)

    return `<style>${base}
      @page{size:A4 landscape;margin:0}
      body{background:#f5f5f5;padding:20px;display:block}
      .print-grid{width:297mm;height:210mm;margin:0 auto;display:flex;flex-direction:column}
      .grid-row{display:flex;flex-direction:row;align-items:stretch;flex:1;min-height:0}
      .grid-row .coupon{flex:1;min-width:0;height:100%;border:${p.borderW} solid #14120b;border-radius:0;overflow:hidden;display:flex;flex-direction:column}
      .cut-v{width:0;flex-shrink:0;position:relative}
      .cut-v::after{content:"";position:absolute;top:0;bottom:0;left:50%;border-left:1px dashed #ccc}
      .cut-h{height:0;flex-shrink:0;position:relative}
      .cut-h::after{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px dashed #ccc}
      .print-hint{text-align:center;font-size:14px;color:#666;margin-bottom:16px;font-family:'DM Sans',sans-serif}
      ${buildPrintOverrides(p)}
      @media print{
        body{background:#fff;padding:0;margin:0}
        .print-hint{display:none}
        .print-grid{width:297mm;height:210mm}
      }
    </style>`
  }

  return `<style>${base}</style>`
}

function buildCouponBlock(config: CouponConfig): string {
  const { venue, event, menu, options } = config
  const cursorLogo = getCursorLogoDataURL()
  const motto = resolveMotto(options.motto)

  const drinkRows = menu.map(buildMenuRow).join('\n')

  const beanChoices = options.beanChoices ?? []
  const milkChoices = options.milkChoices ?? []
  const beanHTML = buildChoiceBlock('Choice of beans', beanChoices)
  const milkHTML = buildChoiceBlock('Choice of milks', milkChoices)

  const menuTitle =
    options.menuTitle?.trim() || 'Choose your drink (mark with X or \u2713)'

  const wifiHTML = venue.wifi
    ? `<div class="wifi"><strong>Wi-Fi:</strong> ${escapeHTML(venue.wifi)}</div>`
    : ''

  const numberHTML = options.showCouponNumber
    ? `<div class="coupon-number">No. <div class="number-box"></div></div>`
    : ''

  const dividerColor = 'rgba(237,236,236,.22)'
  const venueLogoHTML = venue.logo
    ? `<div style="width:1px;height:24px;background:${dividerColor}"></div>
       <img src="${venue.logo}" alt="${escapeHTML(venue.name)}" class="venue-logo" style="height:${venue.logoHeight}px" />`
    : `<div style="width:1px;height:24px;background:${dividerColor}"></div>
       <span style="font-size:15px;font-weight:700;letter-spacing:.02em">${escapeHTML(venue.name)}</span>`

  const brandFooterHTML = motto
    ? `<div class="brand-footer">${escapeHTML(motto)}</div>`
    : ''

  const hasChoices = beanHTML || milkHTML
  const choicesRow = hasChoices
    ? `<div class="choices-row">${beanHTML}${milkHTML}</div>`
    : ''

  return `<div class="coupon">
  <div class="header-band">
    <div class="logos">
      <img src="${cursorLogo}" alt="Cursor" />
      ${venueLogoHTML}
    </div>
    <div class="header-right">
      <div class="date">${escapeHTML(event.date)}</div>
      ${numberHTML}
    </div>
  </div>
  <div class="body">
    <div class="drinks-heading">${escapeHTML(menuTitle)}</div>
    <div class="drink-list">${drinkRows}</div>
  </div>
  <div class="bottom">
    ${choicesRow}
    <div class="bottom-meta">
      ${wifiHTML}
      <div class="footer-note">${escapeHTML(options.footerNote)}</div>
    </div>
  </div>
  ${brandFooterHTML}
</div>`
}

export function generateCouponHTML(
  config: CouponConfig,
  mode: 'single' | 'print' = 'single',
): string {
  const css = buildCSS(config, mode)
  const coupon = buildCouponBlock(config)

  if (mode === 'print') {
    const count = resolveCouponsPerPage(config)
    const isPortrait = config.print.orientation === 'portrait'
    const orientLabel = isPortrait ? 'portrait' : 'landscape'
    const parts: string[] = []

    if (isPortrait) {
      for (let r = 0; r < count; r++) {
        if (r > 0) parts.push('<div class="cut-h"></div>')
        parts.push(`<div class="grid-row">\n${coupon}\n</div>`)
      }
    } else {
      const cols = Math.min(count, 3)
      let placed = 0
      const rows = Math.ceil(count / 3)
      for (let r = 0; r < rows; r++) {
        if (r > 0) parts.push('<div class="cut-h"></div>')
        const colsInRow = Math.min(cols, count - placed)
        const rowParts: string[] = []
        for (let c = 0; c < colsInRow; c++) {
          if (c > 0) rowParts.push('<div class="cut-v"></div>')
          rowParts.push(coupon)
          placed++
        }
        parts.push(`<div class="grid-row">\n${rowParts.join('\n')}\n</div>`)
      }
    }

    const gridHTML = parts.join('\n')
    const autoNote =
      config.print.couponsPerPage === 'auto'
        ? ` (auto: ${count} per page, ${orientLabel})`
        : ''
    const pageW = isPortrait ? '210mm' : '297mm'
    const pageH = isPortrait ? '297mm' : '210mm'

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Print Coupons – ${escapeHTML(config.venue.name)} | Cursor</title>
${css}
</head>
<body>
<p class="print-hint">Print or save as PDF — ${count} coupon${count > 1 ? 's' : ''} per A4 page (${orientLabel})${autoNote}.</p>
<div class="print-grid" style="width:${pageW};height:${pageH}">
${gridHTML}
</div>
</body>
</html>`
  }

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Coffee Coupon – ${escapeHTML(config.venue.name)} | Cursor</title>
${css}
</head>
<body>
${coupon}
</body>
</html>`
}
