'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { Shuffle, Lock, Unlock } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

type PaletteScheme = 'complementary' | 'analogous' | 'triadic' | 'monochromatic'

const SCHEMES: { value: PaletteScheme; label: string }[] = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'monochromatic', label: 'Monochromatic' },
]

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100
  const ll = l / 100
  const a = sl * Math.min(ll, 1 - ll)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generatePalette(baseHex: string, scheme: PaletteScheme): string[] {
  const [h, s, l] = hexToHsl(baseHex)
  switch (scheme) {
    case 'complementary':
      return [
        hslToHex(h, s, l),
        hslToHex(h, s, Math.max(0, l - 15)),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 180) % 360, s, Math.max(0, l - 15)),
        hslToHex(h, Math.max(0, s - 20), Math.min(100, l + 10)),
      ]
    case 'analogous':
      return [0, 1, 2, 3, 4].map(i =>
        hslToHex((h + i * 30 - 60 + 360) % 360, s, l + (i - 2) * 8)
      )
    case 'triadic':
      return [
        hslToHex(h, s, l),
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
        hslToHex(h, s, Math.max(0, l - 12)),
        hslToHex((h + 120) % 360, s, Math.max(0, l - 12)),
      ]
    case 'monochromatic':
      return [0, 1, 2, 3, 4].map(i =>
        hslToHex(h, s, Math.max(5, Math.min(95, l + (i - 2) * 18)))
      )
  }
}

function generateRandomHex(): string {
  return '#' + Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

export default function ColorPalettePage() {
  const [baseColor, setBaseColor] = useState('#f59e0b')
  const [scheme, setScheme] = useState<PaletteScheme>('complementary')
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false])
  const inputRef = useRef<HTMLInputElement>(null)

  const palette = useMemo(() => generatePalette(baseColor, scheme), [baseColor, scheme])

  const handleBaseColorChange = useCallback((value: string) => {
    const hex = value.startsWith('#') ? value : '#' + value
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      setBaseColor(hex.toLowerCase())
    }
  }, [])

  const handleColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value)
  }, [])

  const handleRandomize = useCallback(() => {
    setBaseColor(generateRandomHex())
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const toggleLock = useCallback((index: number) => {
    setLocked(prev => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }, [])

  const exportAsCss = useCallback(() => {
    const vars = palette.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')
    return `:root {\n${vars}\n}`
  }, [palette])

  const exportAsJson = useCallback(() => {
    return JSON.stringify(palette, null, 2)
  }, [palette])

  return (
    <ToolLayout title="Color Palette Generator" description="Generate harmonious color palettes from any hex color.">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={baseColor}
              onChange={(e) => handleBaseColorChange(e.target.value)}
              placeholder="#f59e0b"
              className="w-28 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              maxLength={7}
            />
            <input
              type="color"
              value={baseColor}
              onChange={handleColorInputChange}
              className="h-9 w-9 cursor-pointer rounded-md border border-border"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-border p-0.5">
            {SCHEMES.map(s => (
              <button
                key={s.value}
                onClick={() => setScheme(s.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  scheme === s.value
                    ? 'bg-accent text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleRandomize}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Shuffle size={14} />
            Random
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {palette.map((color, i) => (
            <div key={i} className="space-y-2">
              <div
                className="aspect-square w-full rounded-xl border border-border transition-transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => copyToClipboard(color)}
                title="Click to copy"
              />
              <div className="flex items-center justify-between">
                <code className="font-mono text-xs text-foreground">{color}</code>
                <button
                  onClick={() => toggleLock(i)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={locked[i] ? 'Unlock color' : 'Lock color'}
                >
                  {locked[i] ? <Lock size={12} /> : <Unlock size={12} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {palette.length > 0 && (
          <div className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Export</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(exportAsCss())}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Copy as CSS
              </button>
              <button
                onClick={() => copyToClipboard(exportAsJson())}
                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Copy as JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
