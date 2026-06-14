'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { CopyButton } from '@/components/CopyButton'
import { Upload, Download } from 'lucide-react'

type Mode = 'encode' | 'decode'

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const process = useCallback((value: string, currentMode: Mode) => {
    if (!value.trim()) {
      setOutput('')
      setError(null)
      return
    }
    try {
      if (currentMode === 'encode') {
        setOutput(btoa(value))
      } else {
        try {
          setOutput(atob(value))
        } catch {
          throw new Error('Invalid Base64 input')
        }
      }
      setError(null)
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    process(value, mode)
  }, [mode, process])

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode)
    setInput('')
    setOutput('')
    setError(null)
    setFileName(null)
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string') {
        setInput(result)
        if (mode === 'encode') {
          setOutput(btoa(result))
          setError(null)
        }
      } else if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result)
        let binary = ''
        bytes.forEach(b => { binary += String.fromCharCode(b) })
        setInput(`[binary file: ${file.name}]`)
        if (mode === 'encode') {
          setOutput(btoa(binary))
          setError(null)
        }
      }
    }
    if (mode === 'encode') {
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    }
  }, [mode])

  const handleDownload = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [output, mode])

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text or files to Base64 and decode them back."
    >
      <div className="space-y-4">
        <div className="flex gap-1 rounded-lg border border-border p-0.5 w-fit">
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

        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground">
            {mode === 'encode' ? 'Input (plain text or file)' : 'Input (Base64 string)'}
          </label>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter text to encode...'
                : 'Enter Base64 string to decode...'
            }
            className="min-h-[120px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
            spellCheck={false}
          />
          <div className="flex flex-wrap items-center gap-2">
            {mode === 'encode' && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Upload size={14} />
                  Upload file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            )}
            {fileName && (
              <span className="text-xs text-muted-foreground">File: {fileName}</span>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                {mode === 'encode' ? 'Encoded (Base64)' : 'Decoded (plain text)'}
                <span className="ml-2 text-muted-foreground/60">
                  ({output.length} chars)
                </span>
              </label>
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
            <pre className="max-h-[300px] overflow-auto rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm break-all">
              <code>{output}</code>
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
