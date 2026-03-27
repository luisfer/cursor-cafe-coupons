'use client'

import type { MenuItem } from '@/lib/types'

interface MenuEditorProps {
  items: MenuItem[]
  onChange: (items: MenuItem[]) => void
}

export function MenuEditor({ items, onChange }: MenuEditorProps) {
  const updateItem = (index: number, field: keyof MenuItem, value: unknown) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    )
    onChange(next)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...items, { name: '', temps: ['hot', 'iced'] }])
  }

  const toggleTemp = (index: number, temp: 'hot' | 'iced') => {
    const item = items[index]
    const has = item.temps.includes(temp)

    let next: ('hot' | 'iced')[]
    if (has && item.temps.length > 1) {
      next = item.temps.filter((t) => t !== temp)
    } else if (!has) {
      next = temp === 'hot' ? ['hot', ...item.temps] : [...item.temps, 'iced']
    } else {
      return
    }

    updateItem(index, 'temps', next)
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 group">
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateItem(i, 'name', e.target.value)}
            placeholder="Drink name"
            className="flex-1 !py-1.5 text-sm"
          />

          <div className="flex gap-1">
            <button
              onClick={() => toggleTemp(i, 'hot')}
              className={`px-2 py-1 text-xs rounded cursor-pointer transition-colors ${
                item.temps.includes('hot')
                  ? 'bg-cursor-surface-raised text-cursor-text'
                  : 'bg-cursor-surface text-cursor-text-faint hover:text-cursor-text-muted'
              }`}
            >
              hot
            </button>
            <button
              onClick={() => toggleTemp(i, 'iced')}
              className={`px-2 py-1 text-xs rounded cursor-pointer transition-colors ${
                item.temps.includes('iced')
                  ? 'bg-cursor-surface-raised text-cursor-text'
                  : 'bg-cursor-surface text-cursor-text-faint hover:text-cursor-text-muted'
              }`}
            >
              iced
            </button>
          </div>

          <button
            onClick={() => removeItem(i)}
            className="text-cursor-text-faint hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none cursor-pointer"
            title="Remove drink"
          >
            &times;
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        className="w-full py-1.5 text-sm text-cursor-text-muted hover:text-cursor-text border border-dashed border-cursor-border-emphasis hover:border-cursor-text-faint rounded-md transition-colors cursor-pointer"
      >
        + Add drink
      </button>
    </div>
  )
}
