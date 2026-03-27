'use client'

import { useCallback, useRef, useState } from 'react'
import type { CouponConfig } from '@/lib/types'
import { resolveCouponsPerPage } from '@/lib/print-layout'
import { MenuEditor } from '@/components/menu-editor'

interface ConfigFormProps {
  config: CouponConfig
  onChange: (config: CouponConfig) => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-cursor-text-muted mb-3">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-cursor-text-secondary mb-1">{label}</label>
      {children}
    </div>
  )
}

function IntField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  const [draft, setDraft] = useState<string>(String(value))
  const prevValue = useRef(value)

  if (value !== prevValue.current) {
    prevValue.current = value
    setDraft(String(value))
  }

  const commit = (raw: string) => {
    const n = parseInt(raw, 10)
    if (isNaN(n)) {
      setDraft(String(value))
      return
    }
    const clamped = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, n))
    onChange(clamped)
    setDraft(String(clamped))
  }

  return (
    <Field label={label}>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit((e.target as HTMLInputElement).value)
        }}
      />
    </Field>
  )
}

export function ConfigForm({ config, onChange }: ConfigFormProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const update = useCallback(
    (path: string, value: unknown) => {
      const next = JSON.parse(JSON.stringify(config)) as CouponConfig
      const keys = path.split('.')
      let obj: Record<string, unknown> = next as unknown as Record<string, unknown>
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>
      }
      obj[keys[keys.length - 1]] = value
      onChange(next)
    },
    [config, onChange],
  )

  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        update('venue.logo', reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    [update],
  )

  return (
    <div>
      <Section title="Venue">
        <Field label="Name">
          <input
            type="text"
            value={config.venue.name}
            onChange={(e) => update('venue.name', e.target.value)}
            placeholder="e.g. Blue Bottle Coffee"
          />
        </Field>

        <Field label="Logo">
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-2 text-sm bg-cursor-surface border border-cursor-border-emphasis rounded-md hover:bg-cursor-surface-raised transition-colors cursor-pointer"
            >
              {config.venue.logo ? 'Change logo' : 'Upload logo'}
            </button>
            {config.venue.logo && (
              <button
                onClick={() => update('venue.logo', '')}
                className="text-sm text-cursor-text-muted hover:text-cursor-text transition-colors cursor-pointer"
              >
                Remove
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
          {config.venue.logo && (
            <div className="mt-2 p-2 bg-cursor-surface rounded-md inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.venue.logo}
                alt="Venue logo"
                className="max-h-10 w-auto"
              />
            </div>
          )}
        </Field>

        <IntField
          label="Logo height (px)"
          value={config.venue.logoHeight}
          onChange={(v) => update('venue.logoHeight', v)}
          min={16}
          max={80}
        />

        <Field label="Wi-Fi name">
          <input
            type="text"
            value={config.venue.wifi}
            onChange={(e) => update('venue.wifi', e.target.value)}
            placeholder="e.g. Free Cafe Wifi"
          />
        </Field>
      </Section>

      <Section title="Event">
        <Field label="Date">
          <input
            type="text"
            value={config.event.date}
            onChange={(e) => update('event.date', e.target.value)}
            placeholder="DD.MM.YYYY"
          />
        </Field>
      </Section>

      <Section title="Menu">
        <MenuEditor
          items={config.menu}
          onChange={(menu) => update('menu', menu)}
        />
      </Section>

      <Section title="Options">
        <Field label="Bean choices (comma-separated)">
          <input
            type="text"
            value={(config.options.beanChoices ?? []).join(', ')}
            onChange={(e) =>
              update(
                'options.beanChoices',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            placeholder="e.g. House Blend, Decaf"
          />
        </Field>

        <Field label="Milk choices (comma-separated)">
          <input
            type="text"
            value={config.options.milkChoices.join(', ')}
            onChange={(e) =>
              update(
                'options.milkChoices',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            placeholder="e.g. Regular, Oat"
          />
        </Field>

        <Field label="Menu title">
          <input
            type="text"
            value={config.options.menuTitle ?? ''}
            onChange={(e) => update('options.menuTitle', e.target.value)}
            placeholder="e.g. Cursor Menu"
          />
          <p className="mt-1 text-xs text-cursor-text-muted">
            Custom heading above the drink list. Leave empty for the default.
          </p>
        </Field>

        <Field label="Footer note">
          <input
            type="text"
            value={config.options.footerNote}
            onChange={(e) => update('options.footerNote', e.target.value)}
            placeholder="e.g. Valid for 1 complimentary drink"
          />
        </Field>

        <Field label="Motto / tagline">
          <input
            type="text"
            value={config.options.motto ?? 'Happy building!'}
            onChange={(e) => update('options.motto', e.target.value)}
            placeholder="e.g. Happy building!"
          />
          <p className="mt-1 text-xs text-cursor-text-muted">
            Branded footer bar (Cursor brown). Clear the field to hide the bar.
          </p>
        </Field>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showNumber"
            checked={config.options.showCouponNumber}
            onChange={(e) => update('options.showCouponNumber', e.target.checked)}
            className="!w-auto accent-cursor-text"
          />
          <label htmlFor="showNumber" className="text-sm text-cursor-text-secondary cursor-pointer">
            Show coupon number box
          </label>
        </div>
      </Section>

      <Section title="Print">
        <Field label="Coupons per page">
          <select
            value={config.print.couponsPerPage === 'auto' ? 'auto' : String(config.print.couponsPerPage)}
            onChange={(e) => {
              const v = e.target.value
              update('print.couponsPerPage', v === 'auto' ? 'auto' : Number(v))
            }}
            className="!w-full"
          >
            <option value="auto">Auto (3, 6, or 9 from menu size)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={String(n)}>
                {n} manually
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-cursor-text-muted">
            Auto picks a landscape 3×N grid (9, 6, or 3 per page) so content fits. Print is always
            landscape A4.
            {config.print.couponsPerPage === 'auto' && (
              <span className="block mt-1 text-cursor-text-secondary">
                Current auto resolution: <strong>{resolveCouponsPerPage(config)}</strong> per page
              </span>
            )}
          </p>
        </Field>
      </Section>

      <Section title="Theme">
        <div className="flex gap-3">
          <Field label="Header background">
            <input
              type="color"
              value={config.theme.headerBg}
              onChange={(e) => update('theme.headerBg', e.target.value)}
            />
          </Field>
          <Field label="Header text">
            <input
              type="color"
              value={config.theme.headerText}
              onChange={(e) => update('theme.headerText', e.target.value)}
            />
          </Field>
        </div>
      </Section>
    </div>
  )
}
