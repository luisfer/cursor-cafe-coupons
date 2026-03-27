'use client'

import { useState, useCallback } from 'react'
import type { CouponConfig } from '@/lib/types'
import type { PresetKey } from '@/lib/presets'
import { PRESETS } from '@/lib/presets'
import { generateCouponHTML } from '@/lib/generate-html'
import { ConfigForm } from '@/components/config-form'
import { CouponPreview } from '@/components/coupon-preview'
import { ExportControls } from '@/components/export-controls'

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export default function Home() {
  const [config, setConfig] = useState<CouponConfig>(() => deepClone(PRESETS.classic.config))
  const [presetKey, setPresetKey] = useState<PresetKey>('classic')

  const handlePresetChange = useCallback((key: PresetKey) => {
    setPresetKey(key)
    setConfig(deepClone(PRESETS[key].config))
  }, [])

  const html = generateCouponHTML(config, 'single')

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-cursor-bg text-cursor-text">
      <header className="border-b border-cursor-border px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cursor-logo.svg" alt="Cursor" className="h-7 w-auto" />
          <div className="h-6 w-px bg-cursor-border-emphasis" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-cursor-text-muted">Cursor Community</p>
            <h1 className="text-lg font-bold tracking-tight">Cafe Coupons</h1>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <label htmlFor="preset" className="text-sm text-cursor-text-muted">
              Preset
            </label>
            <select
              id="preset"
              value={presetKey}
              onChange={(e) => handlePresetChange(e.target.value as PresetKey)}
              className="!w-auto !py-1.5 !px-3 text-sm"
            >
              {Object.entries(PRESETS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ExportControls config={config} />
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-[420px] flex-shrink-0 border-r border-cursor-border overflow-y-auto p-6 bg-cursor-bg">
          <ConfigForm config={config} onChange={setConfig} />
        </aside>

        <section className="flex-1 flex items-start justify-center p-8 overflow-auto bg-cursor-bg-dark">
          <CouponPreview html={html} />
        </section>
      </main>
    </div>
  )
}
