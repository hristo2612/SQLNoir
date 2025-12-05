Blog post detail page review (`/blog/[slug]`)

1) Navigation feels inconsistent
- Proposal A: Keep the slim white bar but align like Cases header — left-aligned `Back to Blog` pill + detective label, no right content.
- Proposal B: Convert to a transparent top spacer (no border) and embed a back pill inside the content hero instead of a global nav.
- Proposal C: Replace with a subtle breadcrumb row (`Home / Blog / Post`) using detective font, left aligned, no logo.

2) Hero image is too large
- Proposal A: Use a fixed aspect 16:9 box with max-height ~420px, rounded corners, border, and shadow (current direction).
- Proposal B: Shrink to 4:3 with max-height ~340px and add generous top/bottom padding to breathe like Medium.
- Proposal C: Move the image below the title/excerpt and cap width to ~70% on desktop while keeping 100% on mobile.

3) Mobile typography feels oversized
- Proposal A: Use `text-3xl` title on mobile, bump to `text-4xl` only at sm, and keep excerpt at `text-lg` max.
- Proposal B: Add tighter leading (`leading-snug`) and reduce section spacing on mobile (smaller margins before/after hero/title).
- Proposal C: Apply a mobile-first type scale (e.g., base 16px prose) and only enable `prose-lg` at md+ breakpoints.
