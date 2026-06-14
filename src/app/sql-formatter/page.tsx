'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { CopyButton } from '@/components/CopyButton'
import { format as sqlFormat } from 'sql-formatter'
import { detectDialect } from '@/lib/utils'

type KeywordCase = 'preserve' | 'upper' | 'lower'

export default function SqlFormatterPage() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState(2)
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper')
  const [dialect, setDialect] = useState<'mysql' | 'postgresql' | 'sqlite'>('mysql')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const activeDialect = useMemo(() => {
    if (!input.trim()) return dialect
    const detected = detectDialect(input)
    if (['mysql', 'postgresql', 'sqlite'].includes(detected)) return detected
    return 'mysql'
  }, [input, dialect])

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null }
    try {
      const formatted = sqlFormat(input, {
        language: activeDialect,
        tabWidth: indent === 0 ? 4 : indent,
        useTabs: indent === 0,
        keywordCase: keywordCase === 'preserve' ? 'preserve' : keywordCase,
      })
      return { output: formatted, error: null }
    } catch (e) {
      return { output: '', error: (e as Error).message }
    }
  }, [input, indent, keywordCase, activeDialect])

  return (
    <ToolLayout title="SQL Formatter" description="Format SQL queries with configurable style and dialect support.">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg border border-border p-0.5">
            {(['mysql', 'postgresql', 'sqlite'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDialect(d)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  dialect === d
                    ? 'bg-accent text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {d === 'postgresql' ? 'PostgreSQL' : d === 'sqlite' ? 'SQLite' : 'MySQL'}
              </button>
            ))}
          </div>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={0}>Tabs</option>
          </select>
          <select
            value={keywordCase}
            onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          >
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
            <option value="preserve">Preserve</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Input SQL
            </label>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="SELECT * FROM users WHERE id = 1;"
              className="min-h-[250px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
              spellCheck={false}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Formatted SQL
              </label>
              {output && <CopyButton text={output} />}
            </div>
            {error ? (
              <div className="min-h-[250px] w-full rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400 font-mono">
                {error}
              </div>
            ) : output ? (
              <pre className="min-h-[250px] w-full overflow-auto rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm leading-relaxed">
                <code>{output}</code>
              </pre>
            ) : (
              <div className="flex min-h-[250px] w-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                Formatted SQL will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
