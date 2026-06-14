'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'
import * as jose from 'jose'

interface DecodedToken {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

function formatExpiry(payload: Record<string, unknown>): {
  text: string
  expired: boolean
  notYetValid: boolean
} {
  const now = Math.floor(Date.now() / 1000)
  const exp = payload?.exp as number | undefined
  const nbf = payload?.nbf as number | undefined

  if (!exp && !nbf) return { text: 'No expiration', expired: false, notYetValid: false }

  if (exp && exp < now) return { text: `Expired ${Math.floor((now - exp) / 60)} min ago`, expired: true, notYetValid: false }
  if (nbf && nbf > now) return { text: `Valid in ${Math.floor((nbf - now) / 60)} min`, expired: false, notYetValid: true }

  if (exp) {
    const remaining = exp - now
    const hours = Math.floor(remaining / 3600)
    const mins = Math.floor((remaining % 3600) / 60)
    if (hours > 0) return { text: `${hours}h ${mins}m remaining`, expired: false, notYetValid: false }
    return { text: `${mins}m remaining`, expired: false, notYetValid: false }
  }

  return { text: 'Valid', expired: false, notYetValid: false }
}

export default function JwtDebuggerPage() {
  const [input, setInput] = useState('')
  const [decoded, setDecoded] = useState<DecodedToken | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [secret, setSecret] = useState('')
  const [verified, setVerified] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const decode = useCallback((token: string) => {
    if (!token.trim()) {
      setDecoded(null)
      setError(null)
      setVerified(null)
      return
    }
    try {
      const parts = token.split('.')
      if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts separated by dots')
      const header = JSON.parse(atob(parts[0]))
      const payload = JSON.parse(atob(parts[1]))
      setDecoded({ header, payload, signature: parts[2] })
      setError(null)
      setVerified(null)
    } catch (e) {
      setError((e as Error).message)
      setDecoded(null)
      setVerified(null)
    }
  }, [])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    decode(value)
  }, [decode])

  const handleVerifySignature = useCallback(async () => {
    if (!decoded || !secret) return
    try {
      const algorithms = ['HS256', 'HS384', 'HS512'] as const
      for (const alg of algorithms) {
        try {
          const secretKey = new TextEncoder().encode(secret)
          await jose.jwtVerify(input, secretKey, { algorithms: [alg] })
          setVerified(true)
          return
        } catch {}
      }
      setVerified(false)
    } catch {
      setVerified(false)
    }
  }, [decoded, secret, input])

  const expiryInfo = decoded ? formatExpiry(decoded.payload) : null

  return (
    <ToolLayout title="JWT Debugger" description="Decode, inspect, and verify JWT tokens.">
      <div className="space-y-4">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Paste your JWT here..."
          className="min-h-[100px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
          spellCheck={false}
        />

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {decoded && (
          <div className="space-y-4 animate-fade-in">
            {expiryInfo && (
              <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                expiryInfo.expired
                  ? 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400'
                  : expiryInfo.notYetValid
                  ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400'
                  : 'border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400'
              }`}>
                <Clock size={16} />
                {expiryInfo.text}
              </div>
            )}

            <Section title="Header" color="red" data={decoded.header} />
            <Section title="Payload" color="green" data={decoded.payload} />
            <Section
              title="Signature"
              color="blue"
              data={{ signature: decoded.signature }}
            />

            <div className="rounded-lg border border-border p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Verify Signature</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter secret key..."
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  onClick={handleVerifySignature}
                  disabled={!secret}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Verify
                </button>
              </div>
              {verified === true && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 size={16} /> Signature verified
                </div>
              )}
              {verified === false && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle size={16} /> Signature verification failed
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

function Section({ title, color, data }: { title: string; color: string; data: Record<string, unknown> }) {
  const json = JSON.stringify(data, null, 2)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(json)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [json])

  return (
    <div className={`rounded-lg border-l-4 border-l-${color}-500 border border-border p-4`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className={`text-sm font-semibold text-${color}-600 dark:text-${color}-400`}>
          {title}
        </h3>
        <button
          onClick={handleCopy}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-auto rounded bg-muted/50 p-3 font-mono text-xs leading-relaxed">
        <code>{json}</code>
      </pre>
    </div>
  )
}
