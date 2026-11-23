# Pure Divine Energy — Master Website Audit

Date: 23 November 2026  
Scope: static site source, local build checks, and live-site configuration review.

## Executive summary

The site has a strong visual direction and a working static publishing flow, but it is not yet ready to present itself as a complete lead-generation and booking platform. The largest gaps are the absence of a real submission backend, widespread SEO metadata omissions, duplicated WordPress-export content, and a stylesheet that has accumulated competing page overrides.

The core marketing pages are usable and the latest build check found no broken local asset or internal-link references. The next work should focus on the highest-impact pages and the shared technical foundation before expanding individual services or course detail pages.

## Evidence collected

- 88 HTML pages are generated from `src/pages`.
- The current project build and link check pass: 88 pages and 30 stylesheets, with no unresolved local references.
- `frontend.css` has 2,956 lines and contains many successive page-specific overrides.
- 55 pages have a canonical URL but no meta description.
- 16 pages have neither a canonical URL nor a meta description.
- No JSON-LD structured data was found.
- No `robots.txt` or XML sitemap source file was found.
- No Open Graph tags were found.
- 39 pages still contain WordPress comment forms posting to `/wp-comments-post.php`.
- The shared frontend script deliberately prevents form submission and shows: “Frontend preview only. Your information has not been sent, saved, verified, or charged.”

## Findings and priority

### Critical — needs a real service or business access

1. **Contact, booking, checkout and chat lead forms do not submit.**
   The static frontend blocks POST submissions and does not send email, save leads, reserve a time, or process payment. This is correct behaviour for the current static preview, but it does not meet booking requirements.
2. **Public WordPress comment forms are non-functional.**
   39 archived article pages point to the unavailable `/wp-comments-post.php` endpoint. They should be removed from the static build or replaced by a real commenting system.
3. **The public verification area includes an admin login path.**
   A static site cannot safely protect an administrative area. This should move behind real authentication or be removed from the public site.
4. **Booking, email, calendar, payments and reviews require integrations.**
   These cannot be safely or truthfully completed without approved providers and credentials.

### High — safe frontend and SEO work

1. **Metadata is incomplete.**
   Most public pages need unique meta descriptions, canonical URLs where missing, Open Graph metadata and a clear social preview image.
2. **No structured data.**
   Add only accurate schema matching visible content: `Organization`/`LocalBusiness`, `Service`, `Course`, `BreadcrumbList`, `Article` and eligible `FAQPage`.
3. **No crawl guidance files.**
   Add a sitemap and robots policy after deciding whether private verification paths and duplicate archive pages should be indexed.
4. **Duplicate and thin content exists in the archived WordPress export.**
   Several variations of the same Reiki, Colour Prana and 27-day topics exist. Many pages visibly expose internal “Focus Keyword” and “Meta Description” text, hashtags, archive cards and repeated side content. These should be consolidated, noindexed, redirected or rewritten as an editorial content strategy—not all retained as competing pages.
5. **Service detail information is incomplete.**
   The requested durations, online/offline availability and prices are not verified in the source. They must not be invented.

### Medium — experience, accessibility and maintainability

1. **The design system is not yet consolidated.**
   Repeated CSS overrides make later visual fixes fragile. Establish shared colour, spacing, type, button, card and motion tokens, then retire old override blocks page by page.
2. **Motion needs governance.**
   Existing reveal, carousel and breathing interactions should all respect reduced-motion preferences and remain limited to supporting content rather than competing with it.
3. **Heading and archive structure need cleanup.**
   Some archive/listing pages have no H1, while the Courses page currently exposes two H1s in source due to an older hidden layout. The active page experience should retain one H1.
4. **Performance needs browser measurement.**
   Build validation passed, but no Lighthouse or Core Web Vitals measurement has yet been recorded. Image weight, third-party fonts and unused export assets need browser-based assessment.

## Recommended implementation order

1. Establish shared design tokens and clean up the global CSS architecture.
2. Finalise core conversion pages: Home, Services, Contact/Booking, About, Courses and FAQ.
3. Add technical SEO foundation: descriptions, canonical coverage, social metadata, sitemap, robots and accurate schema.
4. Consolidate duplicate/thin articles and remove broken static comment forms.
5. Build the real booking and enquiry backend after provider choice and credentials are supplied.
6. Complete performance, responsive and browser-console tests before release.

## Business input required before functional integrations

- Approved booking/email provider and sending address.
- Google Calendar account or preferred scheduling tool.
- Real session durations, availability rules and verified service prices, if prices should be public.
- Google Business Profile URL or Place ID for reviews.
- Razorpay approval plus server-side credentials, if payments are required.
- Decision on which duplicate blog/article URLs should remain indexed.
- Confirmation of any verified course certification wording and learning-material details.

## Completed during the current workstream

- Rebuilt the public Courses landing experience with clearer path selection and course cards.
- Corrected visible “Ricky Grandmaster” copy to “Reiki Grandmaster” while retaining legacy route paths so existing links keep working.
- Removed unsupported “Certified Learning” and “Lifetime learning material” wording from the old course source.
- Refined the homepage daily affirmation and several FAQ, About, Contact and course visual sections.

## Validation already completed

- `npm run build` passes.
- `npm run check` passes with no broken local asset or internal-link references.
- Deployment to the custom domain was previously verified for the latest published commit.

