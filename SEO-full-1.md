# SQLNoir SEO full plan

## Snapshot of current state

- Root layout only sets title/description; no canonical/OG/Twitter defaults; no metadataBase.
- Per-page metadata exists only for cases (title/description); blog titles set client-side with `document.title`.
- No JSON-LD anywhere (Org, WebSite, Breadcrumbs, FAQ, BlogPosting, ItemList, Game/SoftwareApplication missing).
- Static sitemap/robots exist but only list `/`, `/blog`, and one post; cases/help/blog posts not included.
- Open-graph image file exists but is unused; hero images hotlink to Medium CDN.

## Global foundation (implement first)

- [x] Set `metadataBase` to `https://www.sqlnoir.com` in `src/app/layout.tsx`; add title template, default description, `alternates.canonical: "/"`, icons, `themeColor`, viewport, apple-touch icon links.
- [x] Default OG/Twitter: `type: website`, url `/`, image `public/open-graph-image.png`, site name, twitter card large image.
- [x] Add Organization + WebSite JSON-LD (name SQLNoir, url, logo `open-graph-image.png`, sameAs GitHub/Discord); include SiteNavigationElement for `/`, `/cases`, `/blog`, `/help`.
- [x] Sitemap: add `src/app/sitemap.ts` to include `/`, `/cases`, all case slugs, `/blog`, all blog slugs, `/help`; set `lastmod` from content data; keep `public/robots.txt` in sync.
- [x] RSS/Atom for blog (e.g., `/blog/rss.xml`) and link in metadata alternates.
- [x] Canonical URLs everywhere via Next metadata; add `hreflang` if i18n planned. (Canonicals set; hreflang not applicable yet.)
- [x] Replace `document.title` usage with `generateMetadata` server-side.
- [x] Host hero images locally or via `next/image`; add descriptive `alt`; preload LCP images where appropriate.

## Page-level checklists

### Home `/`

- [x] `generateMetadata`: title, description, canonical `/`, OG/Twitter with default image.
- [x] JSON-LD: BreadcrumbList (Home); Organization/WebSite if not global.
- [x] Content: add short FAQ (3–5 Qs) and mark as `FAQPage`; ensure CTAs to `/cases` and `/blog`.

### Cases dashboard `/cases`

- [x] `generateMetadata`: title, description, canonical `/cases`, OG/Twitter (type `website/collection`).
- [x] Add H1 (“Case Files”).
- [x] JSON-LD: BreadcrumbList (Home > Cases); ItemList/CollectionPage enumerating cases (position, name, description, url from `getCaseSlug`).

### Case detail `/cases/[slug]`

- [x] `generateMetadata`: canonical per slug, OG/Twitter (`type: article`), description from case description, image fallback used.
- [x] JSON-LD: BreadcrumbList (Home > Cases > Case Title); Game/SoftwareApplication or VideoGame (name, description, genre “SQL detective game”, applicationCategory “Educational”, url, xpReward, isPartOf SQLNoir, author/publisher - Hristo Bogoev).
- [x] Optional: HowTo JSON-LD using `objectives` as steps.

### Blog index `/blog`

- [x] title, description; canonical `/blog`; OG/Twitter.
- [x] JSON-LD: BreadcrumbList (Home > Blog); Blog/CollectionPage + ItemList for posts (headline, url, datePublished, author, image).
- [x] Link RSS in metadata alternates;

### Blog post `/blog/[slug]`

- [x] `generateMetadata`: title, description from excerpt, canonical `/blog/[slug]`, OG/Twitter (`type: article`), published/modified times, image (local or optimized).
- [x] JSON-LD: BreadcrumbList (Home > Blog > Post Title); BlogPosting (headline, description, image, author, publisher SQLNoir, datePublished, dateModified, mainEntityOfPage).

### Help `/help`

- [x] `generateMetadata`: support-focused title/description, canonical `/help`, OG/Twitter.
- [x] JSON-LD: BreadcrumbList (Home > Help); FAQPage using “Quick answers”; ContactPage/Organization contactPoint for Discord and GitHub Issues.

## Content & keyword strategy

- Primary targets: “SQL game”, “SQL detective game”, “interactive SQL tutorial”, “SQL practice”, “learn SQL online”.
- Long-tail: “free SQL learning game”, “SQL practice exercises”, “SQL query challenges”, “SQL game to learn joins”, “SQL game for beginners”.
- Map keywords to pages: home (brand + “SQL game”), cases (practice/challenges), case detail (case-specific themes), blog (tutorial/tips queries), help (support/faq intents).

## Implementation phases

- Phase 1 (critical): global metadata defaults + metadataBase; per-page titles/descriptions/canonicals/OG/Twitter; dynamic sitemap; remove client `document.title`.
- Phase 2 (high impact): JSON-LD (Org/WebSite/SiteNavigation, Breadcrumbs, ItemList, BlogPosting, FAQ, Game/SoftwareApplication/HowTo); RSS feed; local/optimized hero images.
- Phase 3 (enhancements): dynamic OG images, related-content linking, hreflang (if needed), rating/review schema if/when available, pagination metadata, CWV polish.

## Validation checklist

- [ ] Run Google Rich Results Test and Schema.org validator on all page types.
- [ ] Validate OG/Twitter with Facebook Debugger and Twitter Card Validator.
- [ ] Check Lighthouse SEO; ensure canonical/viewport present.
- [ ] Verify sitemap indexed in Search Console; no unwanted robots blocks.
- [ ] Manually inspect H1 hierarchy and internal links; verify OG images render as expected.
