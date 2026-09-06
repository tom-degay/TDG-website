# tomdegay.com — handover notes for Claude Code

This file is for whichever Claude session picks up this project next. It's a personal portfolio site for Tom de Gay (senior product designer, Head of Design at Quantemplate), being moved from a chat-based workflow (Claude/Cowork editing files on Tom's Mac via a device bridge) into Claude Code. Everything below reflects the state of the repo as of this handover.

## What this project is

A static, no-build personal site: home page, about page, contact page, and a case studies section with two long-form case study write-ups. No framework, no bundler, no package.json — just hand-authored HTML files with inline `<style>` blocks, deployed to Vercel.

Repo: `https://github.com/tom-degay/TDG-website.git`, local working copy at `/Users/Tom/Github/TDG-website` on Tom's Mac.

## Architecture

- **Plain static HTML.** Every page is a single `.html` file with its full CSS inline in a `<style>` tag in `<head>`. There is no shared stylesheet, no templating engine, and no build step — what's in the file is what ships.
- **No shared partials.** The site nav (`<nav class="site-nav">`), its CSS, and its mobile-hamburger `<script>` are copy-pasted identically into every page's `<head>`/`<body>`. **Any change to the nav (markup, styling, links, toggle script) must be manually applied to all seven live pages** (see File inventory below). This is the single biggest source of drift risk in this codebase — there is no include mechanism to keep them in sync automatically. (There are now seven pages, not six — `approach.html` was added.)
- **Hosting: Vercel**, configured via `vercel.json`:
  ```json
  { "cleanUrls": true, "trailingSlash": false }
  ```
  This is why internal links are extensionless (`href="/about"` resolves to `about.html`). Keep this in mind when adding new pages — they'll be reachable at `/<filename-without-extension>`.
- **Fonts:** "Fakt Blond SemiBold" self-hosted (`FaktProSemiBold.woff2`/`.woff`, `@font-face` declared per-page) used for all display/heading text via the `.display` class. Body/UI text falls back to the system font stack. "IBM Plex Mono" is pulled from Google Fonts and used for small overline/label text (the `.eyebrow`/`.kicker` pattern, see below).
- **Contact form** (`contact.html`) submits client-side via `fetch` to `https://api.web3forms.com/submit` using a Web3Forms public access key embedded in the form (`access_key` hidden input) — this is a public/publishable key by design for that service, not a leaked secret.
- **No JS framework/dependencies anywhere else.** Inline `<script>` blocks in the codebase: the contact form's submit handler (`contact.html`), the section-TOC scroll-spy on the case study + approach pages, and the mobile nav hamburger toggle (all seven pages — see the mobile nav note below). Plus a GoatCounter analytics `<script>` tag near `</body>` on every page except `about.html`.

## File inventory (current, live site)

| File | Route | Notes |
|---|---|---|
| `index.html` | `/` | Home page: About teaser, Principal Experience (Quantemplate role + video embed), Case Studies preview blocks |
| `about.html` | `/about` | Full About page: photo, sticky LinkedIn/Download CV links, long-form bio copy |
| `contact.html` | `/contact` | Contact page with Web3Forms-backed form |
| `case-studies/index.html` | `/case-studies` | Case studies hub/index — grid of case-block links |
| `case-studies/connecting-organisations.html` | `/case-studies/connecting-organisations` | Case study detail page |
| `case-studies/mapping-inconsistent-schemas.html` | `/case-studies/mapping-inconsistent-schemas` | Case study detail page |

These six all share the `.site-nav` sticky header (brand link + About / Case Studies [with a hover dropdown to the two case studies] / Contact) and the general dark visual language described below.

**Stray files — not part of the live site, need a decision:**

- `index-1.html`, `case-studies/connecting-organisations-1.html`, `case-studies/mapping-inconsistent-schemas-1.html` — these are **pre-restructure backups** (verified by diffing: they still have the old single-page `<header>` pattern instead of `.site-nav`, no About/Contact as separate pages). They're untracked in git and not linked from anywhere live. Ask Tom whether to delete them or keep them as reference before touching — don't assume.
- `about-photo.jpg` — this one **is** a real, needed asset (referenced by `about.html`) but it's untracked in git. It needs to be committed, not removed.

## Git state at handover — nothing about the restructure is committed yet

```
 M case-studies/connecting-organisations.html
 M case-studies/mapping-inconsistent-schemas.html
 M index.html
?? about-photo.jpg
?? about.html
?? case-studies/connecting-organisations-1.html
?? case-studies/index.html
?? case-studies/mapping-inconsistent-schemas-1.html
?? contact.html
?? index-1.html
```

The multi-page restructure (splitting a formerly single-page site into home/about/contact/case-studies-index) happened **entirely outside of version control** — `about.html`, `contact.html`, `case-studies/index.html`, and `about-photo.jpg` have never been committed. The three `M` files are pre-existing tracked files that picked up small edits during this session (see "What changed in this session" below). **One of the first things worth doing in Claude Code is sorting out this commit** — decide what to do with the `-1.html` backups first, then commit the real new pages and the modified ones together with a clear message, since right now a `git stash` or careless `git checkout` could lose the entire restructure.

No CI/lint/test setup exists in this repo — there's nothing to run before committing beyond eyeballing the pages.

## Visual design system / conventions

The site is a dark theme: `color-scheme: dark`, `background: #000` on `html, body`, white text at varying opacity for hierarchy. When adding UI, match these existing conventions rather than inventing new values:

- **Text hierarchy via white opacity**, not different hues: `#fff` for primary/loudest text (headings, brand), `rgba(255,255,255,0.88)` for softened large statement text (used on `.lede`/`.about-statement` after this session's tweak), `rgba(255,255,255,0.68)` for secondary body copy (`.job-desc`, subtitles), `rgba(255,255,255,0.45)` for muted labels/keywords, `rgba(255,255,255,0.35)` down to `rgba(255,255,255,0.12)` for borders/dividers at decreasing emphasis.
- **Link underline pattern**, defined globally per-page near the top of each `<style>` block:
  ```css
  a {
    color: #fff;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.35); /* 0.22 on about.html, see below */
    padding-bottom: 1px;
    transition: border-color 0.15s ease, opacity 0.15s ease;
  }
  a:hover, a:focus-visible {
    border-color: rgba(255, 255, 255, 0.9);
  }
  ```
  External links (`a[target="_blank"]`) get an animated `→` arrow via `::after`.
  **Known footgun:** any scoped rule like `.some-class a { border-bottom-color: ...; }` that doesn't also define its own `.some-class a:hover`/`:focus-visible` override will tie in CSS specificity with the global `a:hover` rule (both are exactly one class/pseudo-class + one type selector) and — because it's declared later in the file — will permanently win, silently killing the hover effect for links in that scope. This exact bug existed in `.about-copy a` in `about.html` and was fixed this session (see below). If you add a new scoped link style, always pair it with its own `:hover`/`:focus-visible` rule.
- **"Eyebrow"/"kicker" overline label style** (used for small caps section labels like "About", "Principal Experience", "Case Studies", and for case study kickers/keywords): IBM Plex Mono, 14px, weight 500, letter-spacing 2px, word-spacing -3px, uppercase, color `#00d8aa` (teal) for the eyebrow itself, `rgba(255,255,255,0.45)` for the muted keyword-list variant. Keyword lists use a middle-dot `·` separator (e.g. "Product strategy · Systems thinking · Process design") — a pipe `|` was used inconsistently in older markup but has been normalized to `·` everywhere as of this session.
- **Section dividers:** `<hr class="rule">` — `border: none; border-top: 1px solid rgba(255,255,255,0.2); margin: clamp(32px,5vw,48px) 0;`. Used between major page sections.
- **Site nav** (`.site-nav`): `position: sticky; top: 0; z-index: 50;`. The translucent blurred background (`rgba(0,0,0,0.86)` + `backdrop-filter: blur(10px)`) lives on **`.site-nav::before`** (absolute, `inset:0`, `z-index:-1`), *not* on `.site-nav` itself — putting `backdrop-filter` on `.site-nav` makes it a "backdrop-filter root" that traps the mobile menu panel's own `backdrop-filter` so the panel can't blur the page. Keep the frost on the pseudo. It intentionally has **no** `border-bottom` (see below) — don't re-add one without being asked. Links: About / Approach / Case Studies (with a hover dropdown to the two case studies) / Contact.
- **Mobile nav (≤640px):** the nav links collapse behind a `.nav-toggle` hamburger button. The `.site-nav-links` list becomes an absolutely-positioned panel below the bar (`display:none` → `display:flex` when `.site-nav.is-open`) with the same frosted `rgba(0,0,0,0.86)` + `backdrop-filter: blur(10px)` as the bar, and the Case Studies dropdown shown inline/expanded. Note the media query also has to re-null `.nav-item:hover/:focus-within .nav-dropdown { transform: none }` — the desktop centring rule (`translate(-50%, …)`) is more specific than the mobile `.nav-dropdown { transform: none }` and otherwise slides the open sub-list off-screen on tap. The bars animate hamburger→X on an overshoot cubic-bezier ("bounce"); the middle bar is hidden with **both** `opacity: 0` **and** `transform: scaleX(0)` (on its own plain-ease transition, `.nav-toggle-bar:nth-child(2)`) — Safari was leaving the middle bar painted with `opacity: 0` alone while the siblings composited, so it needs the geometric collapse too. A small inline `<script>` at the end of each page's `<body>` toggles `.is-open` + `aria-expanded` and closes the menu on link click / Escape / outside click / resize above 640px. **This script and the `.nav-toggle` markup + mobile CSS are copy-pasted into all seven pages** — keep them in sync like the rest of the nav.
- **Anchor scroll offset:** every page with in-page `#hash` links (the two case study detail pages + `approach.html`, all of which have a `<nav class="toc">`) sets `html { scroll-padding-top: 100px; }` right after the `html, body` rule so jumped-to headings land ~44px below the sticky nav instead of behind it. Put it on the scroll container (`html`), not on the target elements — an earlier attempt used `.principle { scroll-margin-top }` on `approach.html` but the ids live on the child `h2.principle-title`, so it was a no-op. **Any new page with a section TOC or hash links needs this rule.**
- **Case blocks** (`.case-block`, used on the home page preview and the case studies index): bordered rounded cards with a hover lift (`transform: translateY(-4px)`, brightened border, background tint) and an arrow that translates on hover. There's an `.is-soon` variant for not-yet-published case studies (no hover lift, muted "Soon" label, `cursor: default`). The lift used to be `scale(1.02)`, but a centred scale grew the card past the page's left/right alignment edges — looked like the card jumped sideways; `translateY` avoids that. The `.has-image` variant additionally zooms its image (`transform: scale(1.03)` on `.case-block-media`, inside `overflow: hidden`).
- **Sticky in-page elements:** when making something sticky within the page (not just the top nav), remember CSS `position: sticky` is bounded by the element's *immediate parent's* box — if the parent is short (e.g. wraps only a photo), the sticky element stops sticking once that parent scrolls out of view. To keep something sticky for the full page scroll, it needs to be a direct child of a full-page-height container, not nested inside a shorter wrapper. On `about.html` this container is `<div class="about-top">` (a `display: flex; flex-direction: column` wrapper around **all** of `<main>`'s content — links, photo, lede, bio). `p.links` is its first child and stays sticky for the whole page because the wrapper is full-page height. The wrapper also exists so the responsive rules can reorder the links (via `order`) to sit below the photo at narrow widths — see the changelog below. If you add content to the About page, keep it inside `.about-top` or the sticky links will stop pinning early.

## Later Claude Code session — nav + about-page responsive work

- **Mobile hamburger nav (≤640px)** — added `.nav-toggle` button + mobile CSS + a ~20-line inline toggle `<script>` to all seven pages. Menu = a solid-black absolutely-positioned panel below the bar; Case Studies dropdown is shown inline/expanded; closes on link click / Escape / outside click / `resize` above 640px. The hamburger animates to an X (`.site-nav.is-open .nav-toggle-bar`). Verified on about / contact / index / connecting-organisations at 375px (open/close, no JS conflict with the TOC or contact-form scripts). The resize-to-close path couldn't be exercised in the test browser (its viewport emulation doesn't fire `resize`), but `window.addEventListener('resize', …)` is standard and fires on real rotation.
- **Standardised the `.site-nav` inner max-width across all six pages** to `900px` base / `1320px` at `min-width: 1100px` (previously varied per page: contact 700px with no wide step, most pages 1080px, case study detail pages 1320px). Merged as PR #1.
- **`about.html` — responsive behaviour for the sticky LinkedIn/Download CV links** (they previously overlapped the photo at narrower widths). Wrapped `p.links` + `.about-header` + `.lede` + `.about-copy` in a new `.about-top` flex-column container (see the sticky note above for why it must wrap everything). Three states:
  - **In both sticky states below**, `p.links` carries `height: 0; margin: 0; overflow: visible` (set on the base rule) so it takes no vertical space and the photo's top edge lines up with the top of the links — the links just overlay the top-right of the layout. There's 60–150px of clearance between the links and the photo across these widths.
  - **≥1100px:** links are a horizontal row (base `<p>` layout, anchors inline), sticky, in the right-hand gutter.
  - **821–1099px** (`@media (max-width: 1099px)`): links stack vertically (`display: flex; flex-direction: column; align-items: flex-end`), still sticky, still in the gutter.
  - **≤820px** (`@media (max-width: 820px)`): the base collapse is undone (`height: auto`, margin restored) and the links become a static, left-aligned row dropped *below* the photo — `position: static` plus flex `order` (`.about-header` 0, `p.links` 1, `.lede` 2, `.about-copy` 3).
  - Breakpoints were chosen by measuring the photo/link bounding boxes in a local browser at a range of widths (photo is `max-width: 620px`; the gutter beside it runs out around 820px). Top-edge alignment and full-page stickiness in the two sticky states were re-verified by checking `p.links` text-top == photo top at scrollY 0, and that `p.links` stayed pinned at `top: 66` when scrolled to the bottom.

## What changed in the earlier session (most recent → oldest)

1. **`about.html` — made the LinkedIn/Download CV links sticky.** They were nested inside `.about-header` alongside the profile photo, so if made sticky there they'd only stay pinned for the photo's height (~620px) before scrolling away with the rest of the page. Fixed by pulling `<p class="links">` out of `.about-header` to be a direct child of `<main>` (so its sticky containing block spans the whole page), and restyling it: `position: sticky; top: 66px; z-index: 40; text-align: right;` (the photo now sits alone in `.about-header`). Verified by rendering the page in a headless browser and checking the links' bounding box stayed pinned at `top: 66` after scrolling 900px.
2. **`about.html` — removed the sticky nav's `border-bottom`**, and matched that same fix across all six live pages (see nav notes above): `.site-nav` no longer sets `border-bottom: 1px solid rgba(255, 255, 255, 0.12);`.
3. **`about.html` — three small visual tweaks from Tom's feedback**, applied only to this page (not yet carried to others — see Outstanding work):
   - Default link underline dimmed: `rgba(255,255,255,0.35)` → `rgba(255,255,255,0.22)`.
   - `.lede` (the big "Hello, I'm Tom…" intro line) darkened slightly: `#fff` → `rgba(255,255,255,0.88)`.
   - Fixed the `.about-copy a` hover-specificity bug described above by adding a dedicated `.about-copy a:hover, .about-copy a:focus-visible { border-color: rgba(255, 255, 255, 0.9); }` rule. Before this fix, links inside the bio paragraphs were stuck at a static `rgba(255,255,255,0.4)` border regardless of hover state.
4. Earlier in this session (before the above), an **initial attempt at the underline/lede tweaks was made against a stale, disconnected copy of the site** in the Claude/Cowork cloud workspace — not the real repo on Tom's Mac — so those edits never actually reached the live files. This was caught when Tom said "I'm not seeing the changes applied locally," at which point work moved to editing the real repo directly via the device bridge (`device_bash`) instead of a local cloud copy. **Practical implication for Claude Code:** none — Claude Code will always be operating directly on this repo, so this particular failure mode doesn't apply. It's noted here only so the history in this file makes sense.
5. Slightly earlier still (reflected in the `M` files in git status — `index.html`, `case-studies/connecting-organisations.html`, `case-studies/mapping-inconsistent-schemas.html`): normalized the case-study keyword tag styling to match the `.eyebrow`/`.kicker` mono/uppercase treatment (14px, weight 500, letter-spacing 2px, word-spacing -3px, uppercase) and switched the `|` separator to `·` in keyword lists. This is already applied consistently across all case-study-keyword instances site-wide (verified — no remaining `|`-separated keyword lists exist).

## Outstanding work / open questions for whoever picks this up

- **Nothing about the multi-page restructure is committed to git.** First real task: decide what to do with the `-1.html` backup files (ask Tom — don't delete unilaterally), then stage and commit `about.html`, `contact.html`, `case-studies/index.html`, `about-photo.jpg`, and the three modified files together with a clear commit message.
- **The underline-dimming and text-darkening tweaks were only requested for, and only applied to, `about.html`.** Tom hasn't yet said whether he wants the same treatment (default link underline at `0.22` instead of `0.35`, primary statement text at `0.88` opacity instead of pure `#fff`) carried over to the home page (`index.html`'s `.about-statement`), contact page, or case study pages. Ask before applying it more broadly — it was scoped to a specific piece of feedback about the about page.
- **`contact.html` still has the old (non-sticky) `p.links` pattern** — LinkedIn/Download CV nested in a `.contact-header` flex wrapper, not pulled out to be sticky like on the about page. Nobody has asked for this to change; flagging only as an inconsistency now that about.html works differently. Same goes for `index.html`, which doesn't have a `p.links` masthead at all anymore (it moved into the nav itself as brand + nav links).
- **No shared nav/partial mechanism.** Every nav change today required editing six files by hand. If more pages get added, or the nav changes again, it's worth considering whether to introduce some kind of build step (even a minimal one — an 11ty/Eleventy setup, or a simple Node script that inlines a shared `_nav.html` partial at build time) purely to remove this duplication risk. Not something to do unprompted — raise it as a suggestion if the opportunity comes up, since Tom may prefer keeping the "no build step" simplicity.
- No automated tests, linting, or CI exist. Any verification is manual/visual (this session used a headless Playwright render to check layout and sticky behavior before touching the live files — worth doing something similar for any non-trivial layout change, since there's no other safety net).
