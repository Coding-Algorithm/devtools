import { ToolCard } from "@/components/ToolCard";
import {
  FileJson,
  Fingerprint,
  Clock,
  FileCode,
  Palette,
  Database,
  Hash,
  Link,
} from "lucide-react";

const tools = [
  {
    href: "/json-formatter",
    title: "JSON Formatter & Validator",
    description: "Format, validate, and explore JSON with a collapsible tree view.",
    icon: FileJson,
  },
  {
    href: "/jwt-debugger",
    title: "JWT Debugger",
    description: "Decode, inspect, and verify JWT tokens instantly.",
    icon: Fingerprint,
  },
  {
    href: "/cron-builder",
    title: "Cron Expression Builder",
    description: "Build cron expressions visually with human-readable descriptions.",
    icon: Clock,
  },
  {
    href: "/base64",
    title: "Base64 Encoder / Decoder",
    description: "Encode text or files to Base64 and decode them back.",
    icon: FileCode,
  },
  {
    href: "/color-palette",
    title: "Color Palette Generator",
    description: "Generate harmonious color palettes from any hex color.",
    icon: Palette,
  },
  {
    href: "/sql-formatter",
    title: "SQL Formatter",
    description: "Format SQL queries with configurable style and dialect support.",
    icon: Database,
  },
  {
    href: "/uuid-generator",
    title: "UUID Generator",
    description: "Generate UUIDs in v4 and v7 formats, singly or in batches.",
    icon: Hash,
  },
  {
    href: "/url-encoder",
    title: "URL Encoder / Decoder",
    description: "Encode and decode URL components with smart auto-detection.",
    icon: Link,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          DevTools
        </h1>
        <p className="mt-2 text-muted-foreground">
          Small tools, sharpened well.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  );
}
