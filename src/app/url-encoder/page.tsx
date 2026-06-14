'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { CopyButton } from '@/components/CopyButton'

type Mode = 'encode' | 'decode'
type Encoding = 'component' | 'full'

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<Mode>('encode')
  const [encoding, setEncoding] = useState<Encoding>('component')
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null }
    try {
      if (mode === 'decode') {
        return { output: decodeURIComponent(input), error: null }
      }
      return {
        output: encoding === 'component' ? encodeURIComponent(input) : encodeURI(input),
        error: null,
      }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, mode, encoding])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
  }, [])

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode)
    setInput('')
  }, [])

  return (
    <ToolLayout
      title="URL Encoder / Decoder"
      description="Encode and decode URL components with smart auto-detection."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg border border-border p-0.5">
            {(['encode', 'decode'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                  mode === m
                    ? 'bg-accent text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m === 'encode' ? 'Encode' : 'Decode'}
              </button>
            ))}
          </div>
          {mode === 'encode' && (
            <div className="flex gap-1 rounded-lg border border-border p-0.5">
              {(['component', 'full'] as Encoding[]).map(e => (
                <button
                  key={e}
                  onClick={() => setEncoding(e)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    encoding === e
                      ? 'bg-accent text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {e === 'component' ? 'encodeURIComponent' : 'encodeURI'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {mode === 'encode' ? 'Input' : 'Encoded URL'}
            </label>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={
                mode === 'encode'
                  ? 'https://example.com/?q=hello world'
                  : 'https%3A%2F%2Fexample.com'
              }
              className="min-h-[120px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
              spellCheck={false}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {mode === 'encode' ? 'Encoded' : 'Decoded'}
              </label>
              {output && <CopyButton text={output} />}
            </div>
            {error ? (
              <div className="flex min-h-[120px] w-full items-center rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : output ? (
              <pre className="min-h-[120px] w-full overflow-auto rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm break-all">
                <code>{output}</code>
              </pre>
            ) : (
              <div className="flex min-h-[120px] w-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                Output will appear here
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">
            <strong>encodeURIComponent</strong> encodes special characters including
            <code className="mx-1 font-mono text-foreground">/ ? &amp; =</code>
            — use for query parameters.{' '}
            <strong>encodeURI</strong> preserves URL structure and is meant for full URLs.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
