'use client'

import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors"
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}
