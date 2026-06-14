export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function detectDialect(sql: string): 'mysql' | 'postgresql' | 'sqlite' {
  const upper = sql.toUpperCase()
  if (upper.includes('SERIAL') || upper.includes('::')) return 'postgresql'
  if (upper.includes('AUTOINCREMENT') || upper.includes('PRAGMA')) return 'sqlite'
  return 'mysql'
}
