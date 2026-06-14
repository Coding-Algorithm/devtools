'use client'

import { useState, useCallback, useMemo } from 'react'
import { ToolLayout } from '@/components/ToolLayout'
import { CopyButton } from '@/components/CopyButton'
import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'

type CronField = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'

const FIELD_OPTIONS: Record<CronField, { label: string; value: string }[]> = {
  minute: [
    { label: 'Every minute', value: '*' },
    ...Array.from({ length: 60 }, (_, i) => ({ label: `:${i.toString().padStart(2, '0')}`, value: String(i) })),
  ],
  hour: [
    { label: 'Every hour', value: '*' },
    ...Array.from({ length: 24 }, (_, i) => ({ label: `${i.toString().padStart(2, '0')}:00`, value: String(i) })),
  ],
  dayOfMonth: [
    { label: 'Every day', value: '*' },
    ...Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: String(i + 1) })),
  ],
  month: [
    { label: 'Every month', value: '*' },
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ],
  dayOfWeek: [
    { label: 'Every weekday', value: '*' },
    { label: 'Sunday', value: '0' },
    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
    { label: 'Saturday', value: '6' },
  ],
}

const FIELD_LABELS: Record<CronField, string> = {
  minute: 'Minute',
  hour: 'Hour',
  dayOfMonth: 'Day',
  month: 'Month',
  dayOfWeek: 'Weekday',
}

const PRESETS = [
  { label: 'Every hour', expression: '0 * * * *' },
  { label: 'Daily at midnight', expression: '0 0 * * *' },
  { label: 'Weekdays 9 AM', expression: '0 9 * * 1-5' },
  { label: 'Every Monday', expression: '0 0 * * 1' },
]

function buildExpression(fields: Record<CronField, string>): string {
  return `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`
}

export default function CronBuilderPage() {
  const [fields, setFields] = useState<Record<CronField, string>>({
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  })

  const expression = buildExpression(fields)

  const { description, nextExecutions, error } = useMemo(() => {
    try {
      const desc = cronstrue.toString(expression)
      const interval = CronExpressionParser.parse(expression)
      const dates: string[] = []
      for (let i = 0; i < 5; i++) {
        const next = interval.next()
        dates.push(next.toDate().toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }))
      }
      return { description: desc, nextExecutions: dates, error: null }
    } catch (e) {
      return { description: '', nextExecutions: [], error: (e as Error).message }
    }
  }, [expression])

  const updateField = useCallback((field: CronField, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }))
  }, [])

  const setPreset = useCallback((presetExpression: string) => {
    const parts = presetExpression.split(' ')
    if (parts.length === 5) {
      setFields({
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4],
      })
    }
  }, [])

  return (
    <ToolLayout title="Cron Expression Builder" description="Build cron expressions visually with human-readable descriptions.">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(Object.keys(FIELD_OPTIONS) as CronField[]).map((field) => (
            <div key={field}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {FIELD_LABELS[field]}
              </label>
              <select
                value={fields[field]}
                onChange={(e) => updateField(field, e.target.value)}
                className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                {FIELD_OPTIONS[field].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.expression}
              onClick={() => setPreset(preset.expression)}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <code className="font-mono text-sm text-foreground">{expression}</code>
            <CopyButton text={expression} />
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
              <p className="text-sm font-medium text-foreground">{description}</p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Next 5 Executions</h3>
              <div className="space-y-1.5">
                {nextExecutions.map((date, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-border px-3 py-2 text-sm text-foreground"
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  )
}
