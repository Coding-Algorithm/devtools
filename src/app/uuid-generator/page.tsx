'use client'

import { useState, useCallback, useMemo } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid'

type UuidVersion = 'v4' | 'v7'

function generateUuids(version: UuidVersion, count: number): string[] {
  const generator = version === 'v4' ? uuidv4 : uuidv7
  const ids = Array.from({ length: count }, () => generator())
  if (version === 'v7') ids.sort()
  return ids
}

export default function UuidGeneratorPage() {
  const [version, setVersion] = useState<UuidVersion>('v4')
  const [count, setCount] = useState(5)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const uuids = useMemo(() => generateUuids(version, count), [version, count])

  const copyAll = useCallback(async () => {
    const text = uuids.join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }, [uuids])

  const copyOne = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch {}
  }, [])

  const handleCountChange = useCallback((value: number) => {
    setCount(Math.max(1, Math.min(100, value)))
  }, [])

  const regenerate = useCallback(() => {
    setCount(c => c)
  }, [])

  return (
    <ToolLayout title="UUID Generator" description="Generate UUIDs in v4 and v7 formats, singly or in batches.">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg border border-border p-0.5">
            {(['v4', 'v7'] as UuidVersion[]).map(v => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                  version === v
                    ? 'bg-accent text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                UUID {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Count:</label>
            <input
              type="number"
              value={count}
              onChange={(e) => handleCountChange(Number(e.target.value))}
              min={1}
              max={100}
              className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground text-center focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <span
            className="cursor-pointer rounded-md bg-accent px-4 py-1.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors"
            onClick={regenerate}
          >
            Regenerate
          </span>
        </div>

        <div className="space-y-1.5">
          {uuids.map((uuid, i) => (
            <div
              key={`${uuid}-${i}`}
              className="group flex items-center justify-between rounded-md border border-border px-3 py-2 hover:border-accent/30 transition-colors"
            >
              <code className="font-mono text-sm text-foreground">{uuid}</code>
              <button
                onClick={() => copyOne(uuid, i)}
                className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                {copiedIndex === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>

        {uuids.length > 0 && (
          <button
            onClick={copyAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Copy all ({uuids.length})
          </button>
        )}
      </div>
    </ToolLayout>
  )
}
