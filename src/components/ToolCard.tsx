import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export function ToolCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-all hover:border-accent/50 hover:shadow-sm hover:-translate-y-0.5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
        Try it &rarr;
      </span>
    </Link>
  )
}
