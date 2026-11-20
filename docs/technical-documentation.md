# Technical Documentation

Portfolio website — SWE363 Assignment 3 (Advanced Functionality)
**Author:** Sana Ammar · **Student ID:** 202337790

---

## 1. Overview

An interactive personal portfolio built as a **React + Vite + TypeScript**
single-page application. It presents a hero, an about section, a filterable
project catalogue, a live Notion reading shelf, a toolkit tab switcher and a
validated contact form, styled as a light, editorial, typography-driven layout
with a considered motion system and **hand-drawn controls** from the drawably
library. The Notion token stays server-side in a Netlify Function.

**Two hard design constraints:** the interface uses **no gradients and no
shadows** — depth comes from the sketched controls, thin rules, spacing and hover
tints.

## 2. Tech Stack

| Layer | Choice | Why |
| ----- | ------ | --- |
| UI library | React 19 | Component model, declarative state |
| Build tool | Vite 8 | Fast dev server and production bundling |
| Language | TypeScript | Catches mistakes (wrong prop / field names) at build time |
| Styling | Plain CSS + custom properties | Small surface, easy theming, no shadows/gradients |
| Components | [drawably](https://www.drawably.dev/) v0.4.2 | Hand-drawn (sketched) buttons, inputs, tabs, cards, alerts, badges, dividers and lists |
| Reading list | Notion API + Netlify Functions | Keeps the Notion token server-side and turns a private book database into a read-only shelf |


The browser bundle has no additional runtime dependencies beyond React, React
DOM, and drawably, which is zero-dependency itself. `@notionhq/client` is used
only by the Netlify Function and never shipped to the client.

## 3. Project Structure

```text
202337790-SanaAmmar-assignment3/
├── index.html                     Vite HTML entry
├── package.json                   Dependencies and npm scripts
├── package-lock.json              Locked dependency versions
├── vite.config.ts                 Vite configuration + dev books middleware
├── netlify/functions/books.mjs    Notion reading-list function (/api/books)
├── eslint.config.js               ESLint configuration
├── tsconfig.json                  Shared TypeScript configuration
├── tsconfig.app.json              Application TypeScript configuration
├── tsconfig.node.json             Tooling TypeScript configuration
├── .gitignore
├── src/
│   ├── main.tsx                   React bootstrap
│   ├── App.tsx                    Page composition
│   ├── index.css                  Design tokens, animation primitives, layout rules
│   ├── App.css                    Component styles
│   ├── data/
│   │   ├── projects.ts            Project catalogue + types
│   │   └── visitorTypes.ts        Audience options + homepage section order
│   ├── lib/
│   │   ├── books.ts                Book types + runtime validation of API data
│   │   └── scroll.ts               Smooth scrolling (reduced-motion aware)
│   ├── hooks/
│   │   ├── useBooks.ts             Reading-list fetch, loading, error and retry
│   │   ├── useLocalStorage.ts       Persistence with safe error handling
│   │   ├── useTheme.ts              Light/dark theme + data-theme attribute
│   │   ├── useRevealOnScroll.ts     IntersectionObserver reveal
│   │   └── usePrefersReducedMotion.ts Tracks the reduced-motion setting
│   └── components/
│       ├── Header.tsx             Nav, greeting, theme toggle, hero + audience switcher
│       ├── AudienceSwitcher.tsx   Persisted audience selection controls
│       ├── About.tsx              Bio + scroll-linked word reveal
│       ├── Projects.tsx           Search / filter / sort / expand + empty state
│       ├── Experience.tsx         Compact experience timeline + impact highlights
│       ├── Research.tsx           Responsive research poster gallery
│       ├── Books.tsx              Notion reading shelf + status filter + compact preview
│       ├── Stack.tsx              drawably tab switcher + toolkit list
│       ├── Contact.tsx            Validated form + animated confirmation
│       ├── Footer.tsx             Giant slide-up name + meta bar
│       ├── BackToTop.tsx          Floating back-to-top button
│       ├── MaskedText.tsx        Line-slide-up heading reveal
│       ├── Reveal.tsx             Fade / rise / blur-in wrapper
│       └── WordsReveal.tsx        Scroll-linked word-by-word paragraph
├── public/
│   └── favicon.svg, poster originals + AVIF/WebP previews
├── docs/
│   ├── ai-usage-report.md
│   ├── technical-documentation.md
│   └── spec-assignment-3.md
└── README.md
```

## 4. Requirements → Implementation Map

| Assignment requirement | Where it is implemented |
| ---------------------- | ----------------------- |
| **External API / live data** | `netlify/functions/books.mjs` + `useBooks.ts` + `Books.tsx` — the Notion Book List is fetched server-side and rendered as a filterable reading shelf with a four-book preview |
| **Dynamic content** | `Projects.tsx` (live search, category filter, sort, expand), `Books.tsx` (status filter and expandable four-book preview), `Stack.tsx` (tabs), `Header.tsx` (time-based greeting, theme toggle) |
| **Visitor personalization** | `AudienceSwitcher.tsx` saves the visitor type in `localStorage`; `App.tsx` reorders sections using `visitorTypes.ts` |
| **Data handling** | `localStorage` for theme and visitor type (`useLocalStorage`), server-side Notion reads, and API-response validation in `src/lib/books.ts`; validated form (`Contact.tsx`) |
| **Animation / transitions** | Masked line reveals, blur-in scroll reveals, scroll-linked word reveal, staggered rows, hover motion, drawably's boiling sketches, footer name reveal, floating button — all reduced-motion aware |
| **Error handling / feedback** | Field-level form errors, an animated form confirmation, empty project/book states, and a reading-list error card with retry |


## 5. Data Handling Details

### localStorage (`useLocalStorage.ts`)
Reads and writes are wrapped in `try/catch` with a safe fallback, so
private-browsing or a disabled store degrades gracefully. The theme uses the key
`portfolio-theme`, and a small inline script in `index.html` applies it before
first paint to avoid a flash of the wrong colours; the first visit follows the
system preference.

The audience switcher stores one of `recruiter`, `researcher`, `student`, or
`browsing` under `portfolio-audience`. `App.tsx` uses that preference to reorder
the homepage sections. The Experience section presents CV-based research,
education and product-design work in a responsive timeline, followed by
selected impact highlights. The CV action links to the supplied Google Drive
document.


### Form validation (`Contact.tsx`)
- Rules: name ≥ 2 chars; email matches an `@` + domain pattern; message ≥ 10
  chars. `noValidate` lets the custom logic own the messaging.
- Errors appear beside the field, are announced (`role="alert"`), and clear as
  the user types. A simulated send shows a spinner then a success message.

### Notion reading list (`netlify/functions/books.mjs`, `useBooks.ts`, `Books.tsx`)

The reading shelf is a **server-side** integration. The browser never sees the
Notion token or the raw database payload.

**Request flow**

```text
Browser → GET /api/books
        → Netlify Function (production) or Vite dev middleware
        → Notion SDK → Book List data source
        → normalise → { books, count, updatedAt }
        → useBooks validates the JSON → Books.tsx renders
```

**Configuration**

| Variable | Purpose |
| -------- | ------- |
| `NOTION_TOKEN` | Internal integration token; required and secret |
| `NOTION_DB_ID` | Database ID from the Notion URL; resolved to its data source |
| `NOTION_DATA_SOURCE_ID` | Optional direct data-source ID when a database has multiple sources |

The integration must be connected to the database in Notion (⋯ → Connections),
otherwise the Notion API returns `object_not_found`.

**Property mapping**

| Notion property | Output |
| --------------- | ------ |
| `Title` (title) | `title` |
| `Author` (rich text) | `author` or `null` |
| `Non/Fiction` (select) | `category` or `null` |
| `Status` (select) | `status`: `finished`, `reading`, `want`, or `unknown` |
| `Rating` (select) | `rating`: 1–5 or `null` |
| `Date` (date) | `date` ISO string or `null` |

Status emoji are stripped and normalised (`🎉 Done` → `finished`, `⏳ Doing` →
`reading`, `🚨 To Do` → `want`). Empty-title rows are ignored. Rows are sorted
reading → finished → want, then by rating, then title. `Notes` and `Quotes` are
deliberately **not** returned.

**Netlify Function**

- ESM function using `@notionhq/client` v5 (CommonJS interop via a default
  import).
- Accepts `NOTION_DB_ID` or a direct `NOTION_DATA_SOURCE_ID`; resolves the
  database's data source with `databases.retrieve`.
- Paginates the data source query in pages of 100.
- Returns `Cache-Control: public, max-age=300, s-maxage=300,
  stale-while-revalidate=600` so the CDN handles repeat visits.
- Errors are logged server-side and returned as a small JSON message
  (`not_configured` or `notion_error`) with `Cache-Control: no-store`.

**Local development**

Vite cannot run Netlify Functions by itself. `vite.config.ts` includes a
`books-dev-api` plugin that loads `.env` with Vite's `loadEnv` and calls the
same exported `fetchBooks` helper as the function. This keeps `npm run dev`
working without installing the Netlify CLI. Production uses
`netlify/functions/books.mjs` through `netlify.toml`.

## 6. Design System & Animation

**Layout & type.** Near-black ink on white; thin hairlines derived from the ink
(`color-mix(in srgb, var(--ink) 12%, transparent)`); tabular monospace labels;
large headings with tight tracking (`letter-spacing: -0.04em`); a serif italic
used sparingly for accent.

**Colour.** Deliberately monochrome: `--accent` simply follows `--ink`, so the
serif italics, solid buttons, the active tab (its label *and* its sketched
underline), the availability dot and the hover states on links, arrows and field
labels are all ink-on-paper. The muted greys, hairlines and surfaces are derived
from the ink with `color-mix()`, so the whole scheme is one colour plus a theme
swap.


**No gradients, no shadows.** Confirmed absent from both the source and the
built CSS. Depth is expressed with drawably's pen strokes, borders, spacing and
a `rgba(0,0,0,0.03)` hover tint.

**Hand-drawn controls (drawably).** Every interactive element is a library
component: `DrawablyButton`, `DrawablyInput`, `DrawablyTextarea`,
`DrawablySelect`, `DrawablyToggle`, `DrawablyTabs`, `DrawablyBadge`,
`DrawablyCard`, `DrawablyAlert`, `DrawablyDivider`, `DrawablyList` and
`DrawablyUnderline`. The library's colours are mapped onto the site tokens
(`--drawably-stroke` / `--drawably-fill` / `--drawably-paper` → ink/bg) so the
sketches re-theme with light/dark mode. Each control draws a fresh seeded sketch
and boils through three frames in pure CSS; drawably ships its own
`prefers-reduced-motion` freeze that our global rule reinforces. Lists are
re-keyed by their contents so the pen markers re-draw whenever the visible items
change.


**Motion tokens** (`index.css`):

| Token | Value | Use |
| ----- | ----- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | entrances / reveals |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | on-screen movement (arrows, rows) |
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | hover / colour changes |
| `--dur-fast` / `--dur` / `--dur-slow` / `--dur-reveal` | 150 / 250 / 500 / 800 ms | micro-interactions → reveals |

**Animation inventory**

| Effect | Where | Implementation |
| ------ | ----- | -------------- |
| Line-slide-up reveal | section headings, hero, contact title | `MaskedText` (`overflow:hidden` + `translateY(110%)`) |
| Fade / rise / blur-in | about intro, contact intro | `Reveal` + `.reveal` |
| Scroll-linked word reveal | about paragraphs | `WordsReveal` writes `opacity` in a `requestAnimationFrame` loop |
| Staggered rise | project rows, stack items | CSS keyframes with per-item `animation-delay` |
| Row hover | project rows | background tint + title `translateX(4px)` + arrow fade-in |
| Sketch boil / re-sketch | every drawably control | library CSS frame counter + a seeded redraw on hover |
| Letter reveal | footer name | per-letter `translateY(110%)` with 40 ms stagger |
| Back-to-top | floating button | opacity + `translateY` with `ease-out` |

Only `transform`, `opacity` and small `filter: blur()` are animated; the JS word
reveal touches `opacity` only and runs outside React's render cycle.

**Reduced motion.** A global `@media (prefers-reduced-motion: reduce)` block
disables animations and shows all content immediately, and
`usePrefersReducedMotion` lets the JS-driven effects opt out too.



## 7. Compatibility

- Targets evergreen browsers (Chrome, Edge, Firefox, Safari). Uses
  `IntersectionObserver`, `matchMedia`, `color-mix()` and `svh` units, each with
  graceful fallbacks where relevant.
- Responsive from 320 px up; verified at desktop and mobile widths.
- Hover-only affordances are always shown on touch devices via
  `@media (hover: none)`.

## 8. Performance

- The 480px AVIF previews are about 25 KB and 37 KB; 960px versions
  are about 74 KB and 130 KB. The 480px WebP fallbacks are about 46 KB and 44
  KB; 960px versions are about 130 KB and 154 KB, compared with 1.39 MiB and
  1.89 MiB PNG originals. Previews are lazy-loaded, and full-resolution
  originals are only requested when opened.
- Typography uses system fonts, avoiding an external font stylesheet and font
  downloads on the critical path.
- Unused selectors and animation rules from removed UI have been removed from
  the stylesheets. Filtering remains in-memory and memoized with `useMemo`.
- Production bundle sizes (`npm run build`, Vite 8.3.1):

  | Asset | Before | After |
  | ----- | ------ | ----- |
  | JavaScript | 285.63 KB / 89.95 KB gzipped | 286.10 KB / 89.77 KB gzipped |
  | CSS | 28.08 KB / 6.68 KB gzipped | 27.76 KB / 6.63 KB gzipped |
  | HTML | 1.75 KB / 0.82 KB gzipped | 1.48 KB / 0.72 KB gzipped |

- No route-level code splitting is used: this is a small single-page application,
  so splitting would add loading states without meaningfully reducing the initial
  payload.
- Animations primarily use `opacity` and `transform`; reduced-motion settings
  disable them. The word reveal updates opacity through `requestAnimationFrame`.
- Lighthouse has not yet been run; these bundle measurements are build output,
  not a substitute for a device-based performance audit.

## 10. Running Locally

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
npm run lint     # ESLint
```

Requires Node.js 20.19+ or 22.12+ (the Vite 8 requirement).
