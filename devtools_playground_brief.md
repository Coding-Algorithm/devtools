# DevTools Playground — Project Brief

**Domain:** devtools.ibrahimtaofeek.com
**Tagline:** *Small tools, sharpened well.*
**Status:** Concept / Pre-build
**Brand Fit:** Curious by nature, full-spectrum range, warm competence

---

## 1. Concept

A single-page progressive web app that hosts a curated collection of small, genuinely useful developer tools. No ads, no login, no tracking. Each tool is a focused, polished micro-app that does one thing well.

The site feels like a craftsman's workbench. Every tool is laid out clearly, works offline once visited, and respects the user's time. No bloat, no signup walls, no analytics.

---

## 2. Why This Project Exists

| Goal | Why It Matters for Ibrahim |
|---|---|
| **Traffic magnet** | Dev tools get shared constantly. Bookmarks, tweets, Reddit replies. Passive reach. |
| **Technical showcase** | Every tool is a miniature fullstack project. Demonstrates React, algorithms, UX, offline support, API design, and testing. |
| **Utility-first brand** | Gives back to the community without asking for anything. Aligns with "trusted partner" pillar. |
| **Conversation starter** | "Built by Ibrahim Taofeek" on every tool. People who use the tools know who made them. |

---

## 3. Tools — Launch Set (v1)

### 3.1 JSON Formatter & Validator
- Paste, upload, or fetch JSON
- Format with configurable indent (2/4 spaces, tabs)
- Tree view with collapsible nodes
- Validate button with error line highlighting
- Minify, copy, download
- Dark/light syntax highlighting

### 3.2 JWT Debugger
- Paste a JWT, instantly decode header + payload
- Color-coded sections (red header, green payload, blue signature)
- Copy individual sections
- Verify signature with a secret (HS256/HS384/HS512)
- Expiration timer showing time remaining
- Warning if token is expired or not yet valid

### 3.3 Cron Expression Builder
- Visual builder: pick minute, hour, day, month, weekday from dropdowns
- Human-readable description generated on the fly ("At 08:00 on Monday-Friday")
- Preset buttons: "Every hour", "Daily at midnight", "Weekdays 9 AM", "Every Monday"
- Next 5 executions shown with dates and times
- Copy expression button

### 3.4 Base64 Encoder / Decoder
- Encode text or file to Base64
- Decode Base64 back to text
- File upload (image, PDF, text) with preview
- Copy, download encoded string
- Character count

### 3.5 Color Palette Generator
- Input a hex color, generate 5-color palette (complementary, analogous, triadic, monochromatic)
- Lock individual colors to regenerate around them
- Copy individual hex codes
- Export palette as CSS variables, JSON, or image
- Random palette button for inspiration

### 3.6 SQL Formatter
- Paste SQL, get formatted output
- Configurable: uppercase/lowercase keywords, indent size, line width
- Supports MySQL, PostgreSQL, SQLite dialects
- Copy formatted query

### 3.7 UUID Generator
- Generate 1 to 100 UUIDs at once (v4, v7)
- Copy all at once or individually
- Auto-generate on page load
- Timestamp-based sortable output for v7

### 3.8 URL Encoder / Decoder
- Encode and decode URL components
- Encode full URL vs encodeURIComponent distinction explained
- Copy button
- Decode automatically on paste (like a smart input)

---

## 4. Pages / Architecture

### Single-page layout

```
/                          → Tool grid (home)
/json-formatter            → JSON tool
/jwt-debugger              → JWT debugger
/cron-builder              → Cron expression builder
/base64                    → Base64 encode/decode
/color-palette             → Color palette generator
/sql-formatter             → SQL formatter
/uuid-generator            → UUID generator
/url-encoder               → URL encoder/decoder
```

Each tool is a separate route. The home page is a responsive grid of tool cards. Each card has: icon, name, one-line description, and a subtle "try it" callout.

### Global layout
- Top bar: "DevTools" logo/brand (links to home), theme toggle (dark/light), GitHub star link
- Content: full-width tool area
- Footer: small — "Built by Ibrahim Taofeek"

---

## 5. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SEO for individual tool pages, SSR for OG images |
| Language | TypeScript | Ibrahim's primary, type safety across tools |
| Styling | Tailwind CSS v4 | Rapid, consistent, small bundles |
| Icons | Lucide React | Clean, consistent, tree-shakeable |
| State | React useState/useReducer per tool | No global state needed, tools are isolated |
| PWA | next-pwa or Service Worker via workbox | Offline support, install prompt |
| Testing | Vitest + Playwright | Unit tests for tool logic, E2E for critical flows |
| Deployment | Docker + Self-hosted (free tier) | Self owned, custom domain |
| Analytics | NONE at launch | If added later, Plausible or Umami (privacy-first) |

### Dependencies per tool
- JSON: `@nicolo-ribaudo/json-tree` or custom tree renderer
- JWT: `jose` (decode only, no signing secrets stored)
- Cron: `cronstrue` (human readable) + `cron-parser` (next executions)
- SQL: `sql-formatter`
- Color: `colorjs.io` or tinycolor2
- UUID: `uuid`

Total dependency impact is small. Most tools rely on a single well-maintained library.

---

## 6. UX & Design Direction

### Visual tone
- Clean, spacious, minimal. Think Linear + Stripe documentation.
- Warm accent colors (amber/orange tones) against neutral backgrounds.
- Dark mode by default with toggle available.
- Monospace font everywhere code is displayed (JetBrains Mono via Google Fonts).

### Interaction principles
- **Result on change:** No submit buttons. The output updates as you type/paste.
- **Copy on click:** Click any output to copy. Visual feedback (checkmark toast).
- **Keyboard shortcuts:** Cmd+Enter to format, Cmd+C to copy output, Escape to clear.
- **Responsive down to 320px:** Tools collapse gracefully. No horizontal scroll on mobile.

### States per tool
Every tool handles these states:
- **Empty:** What the user sees on first visit. Placeholder text, cursor in input.
- **Active:** User has input, output is displayed. Clear button visible.
- **Error:** Invalid input. Red border on input, descriptive error message, no crash.
- **Edge:** Extremely large input (10MB JSON). Handled with a warning or streaming output.

---

## 7. PWA & Offline

- Install prompt on mobile and desktop
- Once visited, all tool pages cache via service worker
- Tools work fully offline after first visit (no network needed for core functionality)
- Generated manifest with theme-color, icons, short_name

---

## 8. Build Phases

### Phase 1 — Foundation (1 week)
- Scaffold Next.js project with App Router, TypeScript, Tailwind
- Set up project structure, shared components, theme system
- Build home page grid layout
- Deploy to Vercel with custom domain

### Phase 2 — Core Tools (2 weeks)
- Build JSON Formatter, Base64, UUID Generator (simpler tools first)
- Build JWT Debugger, URL Encoder/Decoder
- Shared patterns: copy-to-clipboard, error handling, keyboard shortcuts

### Phase 3 — Complex Tools (1 week)
- Build Cron Expression Builder (heaviest UI, interactive dropdowns)
- Build Color Palette Generator (canvas rendering)
- Build SQL Formatter

### Phase 4 — Polish (1 week)
- PWA setup, offline caching
- Dark/light mode with persistence
- OG images for each tool page (for social sharing)
- Keyboard shortcuts documentation
- Performance audit, Lighthouse 100/100

### Phase 5 — Launch (3 days)
- Write docs/README
- Announce on relevant subreddits (r/webdev, r/programming, r/javascript)
- Post on X/dev.to
- Monitor for bugs

---

## 9. Potential Post-Launch Tools

Not for v1. These can be added incrementally.

- HTML entity encoder/decoder
- Regex tester with visual matching
- Timestamp converter (Unix ↔ human)
- YAML ↔ JSON converter
- Lorem ipsum generator
- Diff checker (text comparison)
- JWT generator (with form inputs)
- HTML prettifier
- CSS unit converter (px ↔ rem ↔ em)
- BCrypt hash checker
- Epoch calendar
- Markdown previewer
- Certificate decoder (x509)
- Minifier (JS, CSS, HTML)

---

## 10. Brand Alignment Check

| Brand Pillar | How DevTools Delivers |
|---|---|
| **Curious by nature** | Each tool explores a different technical domain. Tokens, color theory, time scheduling, data serialization. |
| **Full-spectrum range** | Tools span text processing, cryptography, color science, databases, time logic. Shows breadth. |
| **Ethics first** | No tracking, no ads, no login walls. Truly free. Privacy-respecting analytics if any. |
| **Warm competence** | UI is friendly, error messages are helpful not technical, design is visually warm. |

---

## 11. Marketing & Distribution

- **Footer link on every tool:** "Built by Ibrahim Taofeek"
- **GitHub repo:** Open source. Each tool is a folder with its own README.
- **Reddit:** When someone asks "Is there a tool for X?", reply with your tool. Natural fit for Type C (helping) posts.
- **Product Hunt:** Launch as a collection, not per-tool.
- **Dev.to post:** "I built 8 free dev tools in 4 weeks. Here's what I learned."
- **Twitter/X:** Share individual tools with screenshots. Each tool is tweetable.
- **Bookmarks:** DevTools are the #1 most bookmarked category of developer sites.

---

## 12. Success Metrics

| Metric | Target |
|---|---|
| Page load (LCP) | < 1.5s |
| Lighthouse score | 100/100 |
| Tools working offline | All |
| Time to first usable tool | < 3s on 3G |
| Monthly visitors (6 months) | 10,000 |
| Returning visitors | > 30% |
| GitHub stars | > 100 |

---

*Brief prepared for Ibrahim Taofeek — June 2026*
