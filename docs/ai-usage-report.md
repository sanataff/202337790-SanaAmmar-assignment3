# AI Usage Report

**Student:** Sana Ammar<br>
**Student ID:** 202337790<br>
**Assignment:** SWE363 — Assignment 3 (Advanced Functionality)<br>
**Date:** 16 November 2026

## 1. Tools Used & Use Cases

| Tool (model) | How I used it |
| --- | --- |
| OpenCode AI coding agent (DeepSeek V4.1 Flash Free) | Planning, code generation, debugging, documentation and verification support |

I used the OpenCode agent as a pair-programming and review assistant in three
connected stages:

- **Planning:** I asked it to audit the existing React portfolio and turn the
  Assignment 3 requirements into a realistic implementation plan. This produced
  `docs/spec-assignment-3.md`, which I reviewed against the assignment checklist.
- **Implementation and debugging:** I asked it to help fix and extend the Notion
  integration that I had started in `netlify/functions/books.mjs`. It helped me
  understand the current Notion SDK, design the server-side data mapping, add
  the Reading section, and debug the real API errors I hit.
- **Documentation and quality checks:** It helped me draft the README and
  technical documentation sections for the Notion integration, and I used it to
  review the final code and test results.

I did not submit AI output without reviewing it. I ran the project locally,
checked the real Notion data, and corrected the AI suggestions where they did
not match the installed packages or the assignment requirements.

## 2. Benefits & Challenges

### Benefits

- AI helped me move from the assignment requirements to a concrete plan much
  faster, especially for deciding which features could be added without
  changing the portfolio's existing design.
- It explained a real version mismatch: the installed `@notionhq/client` v5
  uses Notion data sources rather than the older `databases.query` method.
- It helped me build the complete reading-list flow — server-side function,
  runtime validation, loading and error states, filtering, responsive styles
  and documentation — in a consistent style.
- It was useful for debugging because it could inspect the actual error
  responses and suggest a focused fix instead of changing unrelated code.
- It helped me practise verifying AI work: linting, type-checking, building and
  exercising the UI states in a browser.

### Challenges

- The starting `books.mjs` used `notion.databases.query`, which no longer exists
  in the installed SDK. AI helped me diagnose it, but I checked the package
  types myself and confirmed that the current API uses `dataSources.query`.

- An early configuration used a Notion **page ID** instead of the **database
  ID**. The API returned a clear validation error, and I corrected the
  environment variables and added a more helpful configuration error.
- AI-generated UI code can look correct without being connected to real data. I
  tested the endpoint against the actual Book List (53 books) and checked the
  Reading / Finished / Want-to-read filters, the error state and the retry
  button.
- The database contains personal notes and quotes. I deliberately excluded those
  fields from the API response and only returned the information shown on the
  page.

## 3. Learning Outcomes

- I learned how Notion's current data-source model works, including how to
  resolve a database ID to its data source and how to paginate a query.
- I learned why secrets such as `NOTION_TOKEN` belong in a server-side function
  rather than in client-side code.
- I improved my understanding of ESM/CommonJS interop in Node.js and Netlify
  Functions.
- I learned to treat TypeScript types as build-time help only, and to validate
  untrusted API JSON at runtime before rendering it.
- I learned how a Vite dev/preview middleware can call the same server helper as
  a production function, so local development does not depend on the Netlify
  CLI.
- I practised a better AI workflow: break the work into small steps, review each
  output, test the real behaviour, and keep the final code understandable enough
  to explain without the AI.

## 4. Responsible Use & Modifications

- I reviewed the generated code before keeping it. I corrected the Notion SDK
  method, the import style and the environment-variable mistake rather than
  accepting the first output.
- I chose to implement the Notion Book List instead of the GitHub option first
  proposed in the specification, because I already had a real book database. I
  recorded that decision in `docs/spec-assignment-3.md`.
- I kept the existing design constraints: no gradients, no shadows, and
  hand-drawn `drawably` controls.
- I removed the unused `dotenv` dependency after confirming that Vite and
  Netlify already load environment variables.
- I limited the API response to title, author, category, status, rating and date.
  Notes and quotes from the private database are not sent to the browser.
- I added runtime validation in `src/lib/books.ts`, so malformed API data becomes
  a friendly error instead of a broken page.
- I verified the result with `npm run lint`, `npm run typecheck` and
  `npm run build`, and checked the reading shelf at desktop and mobile widths in
  light and dark themes.
- I did not copy code from classmates, and I did not use AI to misrepresent work
  that I did not understand. I can explain the Notion request flow, the data
  mapping, the React state used by the shelf, and the error/retry behaviour.

## 5. AI Usage Log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
| --- | --- | --- | --- | --- | --- |
| `C01` | OpenCode (DeepSeek V4.1 Flash Free) | 2026-11-16 | Audit the existing portfolio and plan the Assignment 3 work | `docs/spec-assignment-3.md` | Reviewed the generated specification against the assignment requirements and the existing design constraints. Confirmed the current app structure and kept the spec as a planning document; no production code changed in this conversation. |
| `C02` | OpenCode (DeepSeek V4.1 Flash Free) | 2026-11-16 | Fix the Notion API function and build the Reading section | `netlify/functions/books.mjs`, `src/lib/books.ts`, `src/hooks/useBooks.ts`, `src/components/Books.tsx`, `src/App.tsx`, `src/components/Header.tsx`, `src/App.css`, `vite.config.ts`, `netlify.toml`, `.env.example`, `README.md`, `docs/technical-documentation.md`, `docs/spec-assignment-3.md`, `package.json`, `package-lock.json`, `.gitignore` | Corrected the removed `databases.query` call to the v5 data-source API, fixed the CommonJS import, corrected the page-ID/database-ID configuration, added runtime response validation and loading/error/retry UI. Verified against the real Notion Book List: 53 books returned, filters showed 3 Reading / 35 Finished / 15 Want to read, and the error and retry states worked. Desktop/mobile and light/dark layouts checked; lint, typecheck and production build passed. |
| `A01` | OpenCode (DeepSeek V4.1 Flash Free) | 2026-11-16 | Draft the Assignment 3 AI usage report | `docs/ai-usage-report.md`, `README.md`, `.gitignore` | Restructured the report around the Assignment 3 requirements, added the required usage log, declaration, evidence-package guidance and commit trailer, and checked that no secrets were included. |
| `C03` | OpenCode (Copilot SDK in VS Code) | 2026-11-20 | Shorten the Reading section with an expandable book preview | `src/components/Books.tsx`, `src/App.css`, `docs/technical-documentation.md` | Changed the shelf to show four books initially, with controls to show all matching books or collapse back to the preview; changing the status filter returns to the preview. Updated the technical documentation. Verified with `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check`. |
| `C04` | OpenCode (Copilot SDK in VS Code) | 2026-11-20 | Add research posters with responsive optimized previews | `src/components/Research.tsx`, `src/App.css`, `public/kaustposter-preview.webp`, `public/wids-2025-poster-preview.webp`, `docs/technical-documentation.md` | Added two research poster cards with short descriptions, accessible image text, lazy-loaded responsive WebP previews, and links to the full-resolution originals. Used a compact, centered two-column desktop layout that stacks at narrow mobile widths. Reduced preview sizes from about 1.39 MiB and 1.89 MiB to about 343 KB and 449 KB. Verified with lint, typecheck, and production build. |
| `C05` | OpenCode (Copilot SDK in VS Code) | 2026-11-20 | Add CV-based experience and impact content with timeline styling | `src/components/Experience.tsx`, `src/App.css`, `docs/technical-documentation.md` | Replaced the placeholder with a responsive timeline for AnswerMap research, KAUST Academy, Interverse, and KFUPM research-assistant work; added impact highlights for program selection, WiDS poster award, and campus-wide redesign use. Kept details grounded in the CV supplied in chat. Verified with lint, typecheck, and production build. |
| `C06` | OpenCode (Copilot SDK in VS Code) | 2026-11-20 | Remove GPA impact metric and curve the experience timeline line | `src/components/Experience.tsx`, `src/App.css` | Removed the CGPA highlight and replaced the straight desktop timeline connector with a curved line that follows alternating markers; retained a simple vertical connector on smaller layouts. |
| `C07` | OpenCode (Copilot SDK in VS Code) | 2026-11-20 | Refine the timeline curve, purple styling, and text density | `src/components/Experience.tsx`, `src/App.css`, `docs/technical-documentation.md` | Reworked the connector as an organic, softly wobbling purple SVG thread with a pale violet underlay and crisp milestone dots. Shortened each experience to one concise summary while retaining the role, organization, and date. |
| `C08` | OpenCode (Copilot SDK in VS Code) | 2026-11-20 | Reduce image and font asset transfer on initial page load | `public/kaustposter-preview-480.avif`, `public/wids-2025-poster-preview-480.avif`, `public/kaustposter-preview-480.webp`, `public/wids-2025-poster-preview-480.webp`, `public/kaustposter-preview.avif`, `public/wids-2025-poster-preview.avif`, `public/kaustposter-preview.webp`, `public/wids-2025-poster-preview.webp`, `src/components/Research.tsx`, `index.html`, `src/index.css`, `README.md`, `docs/spec-assignment-3.md`, `docs/technical-documentation.md` | Added responsive 480px/960px poster variants, serving AVIF where supported and WebP otherwise; 480px previews are about 25/37 KB AVIF or 46/44 KB WebP. Kept full-resolution PNGs only for explicit full-poster links, lazy-loaded previews, and removed external Google Fonts requests in favor of the system font stack. Updated the asset inventory and build-size documentation. Verified with lint, typecheck, and production build. |

add illustration --> open code 

add portfolio restructionring based on the visitor type -- >opencode 

## 6. AI Evidence Package

The evidence is submitted separately on Blackboard as:

```text
202337790-SanaAmmar-assignment3-ai-evidence.zip
```

The ZIP must contain:

- `conversations/` — the complete, unedited OpenCode conversations for `C01`
  and `C02`.
- `artifacts/` — the intermediate AI outputs before my edits, including:
  - the initial `docs/spec-assignment-3.md` draft;
  - the first AI-generated version of `netlify/functions/books.mjs`;
  - the first AI-generated versions of `src/lib/books.ts`,
    `src/hooks/useBooks.ts` and `src/components/Books.tsx`;
  - the `A01` AI usage report draft.

The evidence ZIP and the staging folder (`ai-evidence/`) are not committed to the
repository. They are also listed in `.gitignore`. The `NOTION_TOKEN` is never
included in the report or the evidence package.

## 7. Commit Credit

Commits containing AI-assisted code or documentation will include the trailer:

```text
Assisted-by: OpenCode (DeepSeek V4.1 Flash Free)
```

This applies to the commit(s) for the Assignment 3 specification, the Notion
reading-list implementation, and the Assignment 3 documentation updates.

## 8. AI Usage Declaration (Required)

I declare that this report and the attached evidence document all of my AI use in
this assignment, with complete and unedited conversations, and that I understand
and can explain all the code I submitted. I understand that undeclared AI use or
a false declaration will be treated as plagiarism according to KFUPM regulations.

**Full Name:** Sana Ammar<br>
**Student ID:** 202337790<br>
**Date:** 16 November 2026<br>
**Signature:** Sana
