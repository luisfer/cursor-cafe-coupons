'use client'

import { useCallback } from 'react'
import type { CouponConfig } from '@/lib/types'
import { generateCouponHTML } from '@/lib/generate-html'

interface ExportControlsProps {
  config: CouponConfig
}

export function ExportControls({ config }: ExportControlsProps) {
  const handlePrint = useCallback(() => {
    const html = generateCouponHTML(config, 'print')
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.onload = () => win.print()
  }, [config])

  const handleSaveHTML = useCallback(() => {
    const html = generateCouponHTML(config, 'print')
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coupons-${config.venue.name.toLowerCase().replace(/\s+/g, '-')}.html`
    a.click()
    URL.revokeObjectURL(url)
  }, [config])

  const handleSaveJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coupon-config-${config.venue.name.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [config])

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSaveJSON}
        className="px-3 py-1.5 text-sm text-cursor-text-muted hover:text-cursor-text border border-cursor-border-emphasis hover:border-cursor-text-faint rounded-md transition-colors cursor-pointer"
      >
        Save Config
      </button>
      <button
        onClick={handleSaveHTML}
        className="px-3 py-1.5 text-sm text-cursor-text-muted hover:text-cursor-text border border-cursor-border-emphasis hover:border-cursor-text-faint rounded-md transition-colors cursor-pointer"
      >
        Save HTML
      </button>
      <button
        onClick={handlePrint}
        className="px-4 py-1.5 text-sm font-semibold bg-cursor-text text-cursor-bg rounded-md hover:opacity-90 transition-opacity cursor-pointer"
      >
        Print
      </button>
    </div>
  )
}
