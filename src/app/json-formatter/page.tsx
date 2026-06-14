'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { CopyButton } from '@/components/CopyButton'
import { Copy, Upload, AlertCircle } from 'lucide-react'

type ViewMode = 'formatted' | 'minified' | 'tree'
type Tab = 'input' | 'output'

export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState(2)
  const [viewMode, setViewMode] = useState<ViewMode>('formatted')
  const [activeTab, setActiveTab] = useState<Tab>('input')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null }
    try {
      const parsed = JSON.parse(input)
      if (viewMode === 'minified') {
        return { output: JSON.stringify(parsed), error: null }
      }
      return { output: JSON.stringify(parsed, null, indent), error: null }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, indent, viewMode])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setInput((ev.target?.result as string) || '')
    }
    reader.readAsText(file)
  }, [])

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch {}
  }, [])

  const handleClear = useCallback(() => {
    setInput('')
  }, [])

  return (
    <ToolLayout title="JSON Formatter & Validator" description="Paste, upload, or fetch JSON. Format, validate, and explore.">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-lg border border-border p-0.5">
            {(['input', 'output'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-accent text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'input' ? 'Input' : 'Output'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'output' && output && (
              <CopyButton text={output} label="Copy" />
            )}
          </div>
        </div>

        {activeTab === 'input' ? (
          <div className="space-y-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here, e.g. {"name": "DevTools"}'
              className="min-h-[200px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
              spellCheck={false}
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePaste}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Copy size={14} />
                Paste
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Upload size={14} />
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              {input && (
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 rounded-lg border border-border p-0.5">
                {(['formatted', 'minified', 'tree'] as ViewMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-accent text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
              {viewMode !== 'minified' && (
                <select
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={0}>Tabs</option>
                </select>
              )}
            </div>

            {error ? (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Invalid JSON</p>
                    <p className="mt-1 text-xs text-red-500/80 font-mono">{error}</p>
                  </div>
                </div>
              </div>
            ) : output ? (
              <div className="relative">
                <pre className="max-h-[500px] overflow-auto rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm leading-relaxed">
                  <code>{output}</code>
                </pre>
                <div className="absolute right-2 top-2">
                  <CopyButton text={output} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-12 text-sm text-muted-foreground">
                {input ? 'Processing...' : 'Enter JSON to see formatted output'}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
