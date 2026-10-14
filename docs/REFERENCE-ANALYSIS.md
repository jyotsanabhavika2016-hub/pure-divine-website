# Reference analysis and verification

Reference: https://puredivineenergy.com/, inspected 13 October 2026. `MAM_WEBSITE_URL` was treated as a placeholder for this site based on the preceding owner-authorized task.

## Visual system

- Warm ivory surfaces, plum text (`rgb(64, 39, 68)`), muted gold accents and gold-to-orange primary buttons.
- Cormorant Garamond headings, Inter body copy and controls, Plus Jakarta Sans on some article titles. Browser-delivered font URLs are recorded in `REFERENCE-ASSETS.json`.
- Rounded cards, thin warm borders, soft shadows, full-width colored section bands and bounded centered containers.
- Desktop navigation and booking CTA share a horizontal header. Tablet/mobile navigation collapses to a menu button and stacked links.
- Desktop hero places the heading, description, CTAs and statistics beside the decorative energy panel; mobile stacks those blocks.
- Homepage: hero, quotation, body/mind/soul benefits, healer introduction, courses, process, services, catalog, testimonials, articles, consultation CTA, form and footer.
- Grids reduce their columns at smaller widths. Course and certificate portals retain their distinct public designs.
- Public chat has a launcher, panel, quick actions, input and callback form; this implementation uses local guided responses.

## Changes

The existing authorized public recovery was migrated to editable source files and a dependency-free build. Headers/footers are shared partials, repeated inline CSS is deduplicated, and standalone browser interactions are readable ES modules. Original assets and published content are retained.

Correcting the earlier downloader's Google Fonts URLs and retaining the browser-delivered WOFF2 references resolved course-card wrapping differences. The observed sparkle SVG restores article-title emoji sizing. A narrow-screen archive-grid correction removes negative-margin overflow without changing article content width.

Forms use native validation and explicit frontend-preview feedback. They do not send to WordPress, course, verification or chat APIs. Checkout retains “Continue to Payment” and displays preview-only feedback when submitted.

## Verification

| Check | Result |
| --- | --- |
| Root-path build | 87 pages; asset and syntax checks passed |
| `/pure-divine-energy/` build | 87 pages; subfolder asset and syntax checks passed |
| Homepage at 1440px | All measured main-heading rectangles matched reference |
| Homepage at 768px | All measured heading rectangles matched; no broken images/overflow |
| Homepage at 375px | All measured heading rectangles matched; no broken images/overflow |
| Mobile page samples | Services, About, Courses, Contact, Blog, course catalog and certificate screen checked |
| Mobile menu | Open and Escape close verified |
| Contact form | Labels, validation and local-only feedback checked with synthetic values |
| Chat | Keyboard launch, guided reply and Escape close verified |
| Repository-path browser preview | Styles, scripts and images loaded; menu navigated to Services; checkout feedback stayed local |

Geometry comparison uses DOM measurements, not a pixel-difference score. Browser screenshots were visually reviewed. GitHub deployment is prepared, but has not run on GitHub. Not every screen has been visually verified at every possible viewport.

No database, authentication, payments, AI backend, certificate records, automatic email delivery or private course content is included. Those public screens are frontend-only. Native validation, visible keyboard focus and the mobile blog fix are intentional usability differences.
