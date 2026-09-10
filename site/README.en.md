# Maintaining the Fieldbook site

English companion to [the Korean guide](README.md). The existing Markdown/OKF files remain the only content source. This is an ordinary Git repository, not a separate GitHub Wiki repository.

On wide home screens, the introduction and reading paths sit side by side; smaller screens stack them in reading order. Topic descriptions and document counts come from existing public data. Korean article text favors breaks between words. The current document uses a background highlight, while the selected reading path uses link emphasis.

Read the first document links to the first step in the source reading order and preserves the selected path. Topics with documents appear first; upcoming topics are collapsed. Topic document counts are distinguished from the total reading path count. On mobile, parent breadcrumbs collapse and the table of contents has a bounded height with collapsed subsections. Selecting a section closes the contents and focuses its heading. Each diagram is rendered from a button in its code block; focus moves to the result and returns to the button when closed.

## Commands

From the repository root, use Bun **1.4.0**, Python 3.10+ with PyYAML, and Node **24.15.0** for Playwright's Node ESM loader only.

```sh
bun install --frozen-lockfile
python3 -m pip install -r requirements.txt
bun run browser:install
bun run dev
bun run docs:validate
bun run lint
bun run typecheck
bun run test
bun run build
bun run test:e2e
bun run preview
bun run verify
```

On Linux, install browser system libraries if necessary with `node node_modules/@playwright/test/cli.js install --with-deps chromium`. Development uses port 5173 and preview uses 4173, both under `/engineering-fieldbook/` by default. Development watches source changes and rebuilds real static files; refresh the browser after completion. There is no HMR. Restart after configuration/environment changes. No runtime server is required after deployment.

## Sources and output

`site/config.ts` defines publication roots, individually approved attachments, base/origin, and the actual GitHub source repository/branch. `site/scripts/content.ts` parses Markdown/YAML and derives links, metadata, translations and navigation. `site/src` contains React UI and search, not manually maintained content.

Only **site/dist** is deployable. Do not edit or commit generated files. `site/.generated/report.json` records public mappings, exclusions, warnings, failures and copied assets; keep it private because it can include excluded paths. `site/.server` is a build module and must not be deployed. Public `documents.json` and `search.json` contain only published documents.

Navigation follows existing index link order and section headings. New Markdown files automatically get pages and search entries, with `NOT_IN_INDEX` warnings when omitted from manual indexes. There is currently no SUMMARY.md or MDX; introducing another navigation format requires an explicit adapter policy update.

Canonical routes use Korean without a language prefix and English under `/en/`, as detailed below. Keep the trailing slash in URLs. The adapter distinguishes localized indexes from common indexes and preserves README basenames; each path segment is URL-encoded. It supports relative Markdown links, reference links/images, approved attachments, and GitHub-style Korean/duplicate heading anchors. Broken links/anchors, URL collisions and duplicate language pairs fail the build.

## Publication and rendering

Published roots: knowledge, glossary, decisions, experiments, failures, lessons, checklists, runbooks, policies; root files: index.md, README.md, log.md. This is a site policy, not an OKF exclusion feature.

Excluded: tools, configuration/agent files, templates, hidden paths, private/internal/draft/drafts/secrets paths, `status: draft`, `draft: true`, `private: true`, `publish: false`, `public: false`, `visibility: private|internal`. MDX is excluded and never executed. Symlinks are not traversed. Authors must review public source content for sensitive information; this filter is not natural-language DLP.

Links to excluded files show an unavailable state. Copy only referenced assets individually approved in `config.assets`. The existing experiment's JSON and Python files are reading material; Python is never executed on the website. Review new attachments before approving them. Active SVG/HTML/JS attachments are prohibited. Never copy repository directories or a Vite public folder wholesale.

Raw HTML is omitted with a warning. GFM is processed through an AST, sanitization and static syntax highlighting. Unsafe URLs fail validation. Wiki `[[...]]` syntax is not present and is explicitly rejected if introduced. Mermaid shows its source first and loads only when requested, with strict security and sanitized SVG. On failure, source remains readable. Document instructions/code are never executed by the build.

## Languages, dates and search

Korean is the default site language; English links navigate to the actual English translation and its English interface. Pair documents by existing concept_id; pair language indexes by matching paths. Preserve discovered additional languages. Missing translations show their state and a browse alternative. Display existing translation status, status, historical/current mode and verification records without inventing new verification.

Modified dates use the later valid generated.at or actual Git modification timestamp and identify the source. Unknown dates remain unknown. CI fetches full history. log.md remains the knowledge change log, not the application change log.

Search lazily downloads static search.json, uses Unicode NFKC/lowercase normalization and whitespace-separated AND substring matching, and ranks title above tags above body. Real Korean/English queries are tested. It has no Korean morphology, particle removal, synonyms or typo correction. It returns at most 30 results. Consider index sharding or another engine if content grows substantially.

## Static generation and Pages

React Router prerender was considered; plain document navigation needs no runtime router. Following the Vite SSR model, the build executes React renderToString for every document after the client build. Every URL has actual article HTML. Ordinary links navigate full pages; hydration adds search, theme and copying. There is no SPA fallback.

Use the same SITE_BASE for build, preview and browser tests. Use `/` for a root site or `/repository/` for a project site. SITE_ORIGIN is an HTTP(S) origin without a path/trailing slash and controls canonical/sitemap URLs. Custom domains also require Pages/DNS configuration.

The Pages workflow validates PRs and all main changes, including document-only changes. PRs have contents:read only and never deploy. A successful main push/manual run uploads site/dist and uses official GitHub Pages actions. User setup: review and commit/push changes, choose Settings → Pages → GitHub Actions, optionally set SITE_BASE/SITE_ORIGIN variables, and configure the github-pages environment's branch/reviewer rules. Repository visibility is not changed. Remote Actions and public deployment are not claimed as tested.

## Verification limits

`bun run verify` runs the existing audit and site checks. The audit's external URL list does not verify external technical facts or translation semantics. Follow the existing refresh workflow when content ages; never extend verification dates automatically.

Chromium tests use a static server without SPA fallback, check all public documents/local links/anchors, no-JavaScript article reading, search, translation, 404, code copying and Mermaid. Light/dark screenshots at 375, 768 and 1440 pixels are generated under artifacts/ui-review/verification. Safari/Firefox, the real Pages domain and remote Actions remain separate checks.

Raw HTML nodes are removed before generating headings, descriptions and search data. Remote images, including reference images, fail validation. Images must use reviewed local assets; ordinary external navigation links remain supported.

## Language routes and reading interface

Korean uses the base URL without a language prefix, e.g. `/knowledge/cloud/aws-ec2/`; English uses `/en/knowledge/cloud/aws-ec2/`. Other existing languages retain their own prefix. Source paths remain unchanged. Localized `index.md` becomes a directory route (`/knowledge/`), while a separate common index keeps its basename (`/knowledge/index/`). README basenames are preserved and actual collisions fail validation.

The root home is Korean and `/en/` is English. Interface labels, navigation and the default search filter follow the page language. The header language links navigate to the same concept's translation. Missing translations are disabled with an explicit alternative language-home link; no translation body is generated. Korean-only change history is marked as Korean from English screens. Explicit cross-language links in original article bodies are preserved.

The interface uses neutral backgrounds, a simple sidebar, and readable document typography. Light/dark themes, mobile navigation, keyboard search, and code/diagram tools are available.

Previous `/docs/<source-without-md>/` bookmarks receive static noindex article pages generated from the same originals. Without JavaScript the original URL, query and anchor remain while the article stays readable. With JavaScript the browser moves to the canonical URL with query and anchor preserved. `site/dist/redirects.json` lists only public aliases. Search, canonical links and sitemap use the new routes exclusively.

The persistent All collections link opens the existing root index, preserving discovery of decisions, experiments, checklists, runbooks and policies. English screens explicitly label this map as Korean.

GitHub Pages returns one shared `404.html` for missing paths. With JavaScript, the error screen derives its language from the requested URL and updates labels, home links and search while retaining HTTP404 and the URL. Without JavaScript, Pages cannot select a locale-specific404: the shared page provides Korean text plus an explicit English message and English-home link. Normal localized document HTML is unaffected.

## Global navigation and learning paths

The sidebar preserves topic order from each language's Knowledge index and reads documents from each domain index. It expands the current document's domain and stores disclosure state and scroll position in sessionStorage per base and language. Basic navigation works when storage is blocked. The glossary and All collections link provide access to other document types.

Learning paths are parsed from ordered-list links under `## Reading order` (Korean `## 학습 순서`) in original indexes. Link order defines the sequence independently of the topic catalog. Duplicate, missing, excluded, or other-language steps are validation errors. Add paths through this convention without copying document lists into React. Keep Korean and English sequences equivalent.

The selected path travels in `?path=` through member documents, translations, and previous/next links. Direct entry or an invalid path shows a chooser. Position indicates reading order, not completion. Canonical URLs and sitemaps remain query-free. Without JavaScript, the global tree and original ordered list remain readable; query-based selection and previous/next controls become available after hydration.
