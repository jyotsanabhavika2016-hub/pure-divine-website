# Pure Divine Energy rebuild

Independent static recovery of the public website, obtained on 12 October 2026 using the ui-ux-pro-max skill for interface checks. The original HTML, responsive styles, photos, logos and fonts are retained locally.

## Contents

- `dist/`: editable pages and local assets, ready for static hosting.
- Main site: Home, Services, Courses, Contact, About, Blog with pagination and recovered articles, booking and legal pages.
- `/learn/`: course catalog, six course detail screens and six enrollment screens recovered from the course subdomain.
- `/verify/`: public certificate verification and administrator sign-in screens.
- `dist/clone-support.js`: independent form behavior.
- `dist/clone-chat.js`: local guided assistant using published course and contact information.
- Recovery reports list every retrieved URL and download failure. The only reported download failures are an unused Google Fonts root preconnect URL; the actual font stylesheets and font files were downloaded.

## Run and edit

Use `npm run dev` with Node.js installed, then open http://127.0.0.1:4173. No dependency installation or build is required. Edit the HTML in `dist/` and the CSS in `dist/assets/`. Shared headers/footers are copied into each page, so apply shared edits consistently. Publish the contents of `dist/` to a static host.

## Backend work still required

This is a recovery of publicly available pages, not the unavailable developer's PHP/Laravel source or database. Contact and callback forms compose email drafts; visitors must send those drafts themselves. Enrollment forms send enquiries instead of charging customers. The assistant is a local guided menu, not the previous AI chat service. Certificate records, certificate generation, admin authentication, student accounts, orders, payments, automated email delivery and any private learning materials cannot be recovered from public pages and are not connected. Certificate and sign-in submissions clearly report that the backend is not connected; no fake verification or authentication is performed.

Before replacing the live domain, implement the required backend and import your certificate/student records, connect your own payment and email accounts, and configure the domain. The original live website has not been changed.

The recovery scripts are included for provenance. Re-running `mirror.mjs` overwrites matching recovered pages and requires reapplying adaptations; use the editable `dist/` files for ongoing changes.
