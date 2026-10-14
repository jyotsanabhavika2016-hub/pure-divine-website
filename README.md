# Pure Divine Energy frontend

Frontend recreation of the owner-authorized public website at https://puredivineenergy.com/. The existing HTML/CSS/JavaScript stack is retained, with a dependency-free Node.js build. No application backend is included.

There are 87 public-page screens: main site, booking/legal pages, blog articles and archives, the course catalog and six detail/enrollment paths, plus public certificate/admin screens. Course and verification subdomains are represented locally at `/learn/` and `/verify/`.

## Run locally

Install Node.js 22 or newer and run from this project directory:

```powershell
npm run dev
```

Open http://127.0.0.1:4173/. No `npm install` is needed. Stop with Ctrl+C. After editing source files, run `npm run build` and refresh the browser.

```powershell
npm run build
npm run check
npm start
```

The server only serves static files; it does not implement application APIs.

## Where to edit

| Location | Purpose |
| --- | --- |
| `src/pages/index.html` | Homepage content and sections |
| `src/pages/<route>/index.html` | Individual screens and articles |
| `src/partials/` | Reusable site/portal headers and footers |
| `src/assets/styles/frontend.css` | Responsive and accessibility corrections |
| `src/assets/styles/inline-*.css` | Deduplicated original public styles |
| `src/assets/*.css` | Local theme and font stylesheets |
| `src/assets/scripts/frontend.js` | Menu, labels, validation and preview feedback |
| `src/assets/scripts/chat.js` | Local guided chat |
| `scripts/build.mjs` | Resolve partials and generate static output |
| `scripts/check.mjs` | Page/CSS reference checks and JS syntax validation |
| `dist/` | Generated root-path build; edit `src/` instead |
| `docs/REFERENCE-ANALYSIS.md` | Design analysis and verification details |

The earlier recovery/migration scripts remain for provenance. Do not rerun them during ordinary editing: they can overwrite page content. Normal builds never change `src/`.

## Frontend scope

Menus, links, blog pagination, native form validation, keyboard handling and guided chat work in the browser. Forms display explicit preview feedback and do not send, save, verify, authenticate, enroll or charge. Callback forms follow the same rule. Chat reproduces the visible widget with local published information, not an AI service. Phone, email and WhatsApp links retain the owner's public contact details.

Original public images, fonts and icons are retained. Exact browser-delivered font CSS and the observed sparkle icon are recorded in `REFERENCE-ASSETS.json`. No private source, records, learning materials or credentials were retrieved.

## GitHub preparation

Use this project directory as the repository root. Include `src/`, `scripts/`, `docs/`, `.github/`, `package.json`, `server.mjs`, `.gitignore`, this README and `REFERENCE-ASSETS.json`. The prepared ZIP contains source and build instructions, without `.git` history or Sites identity. Run `npm run dev` to build the pages after unpacking.

After unpacking the ZIP into a new directory, run `git init -b main` once. The existing workspace checkout already has Git history. Create your own empty GitHub repository, replace the example URL, and run:

```powershell
git add src scripts docs .github package.json server.mjs .gitignore README.md REFERENCE-ASSETS.json
git commit -m "Prepare Pure Divine Energy frontend"
git remote add github https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push github main
```

This uses a separate GitHub remote and preserves any existing Sites remote. This task did not create or push a GitHub repository.

## GitHub Pages

The supplied `.github/workflows/pages.yml` is **manual-only**. Pushing code to `main` does not trigger this workflow or publish the website. Do not run it unless you explicitly want GitHub Pages hosting. If hosting is requested later, select **Settings → Pages → Source → GitHub Actions**, then run the workflow manually. It builds and checks, uploads only `build/`, and deploys. Pages metadata sets the correct repository or root-domain base path. The workflow follows GitHub's [custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Test a repository-subfolder build in PowerShell:

```powershell
$env:OUTPUT_DIR = "github-preview"
npm run build -- --base /pure-divine-energy/
npm run check
$env:PORT = "4174"
npm start
```

Open http://127.0.0.1:4174/pure-divine-energy/. Replace that base path with your repository name. A new terminal returns to the default `dist/` and port 4173; to reset the current terminal:

```powershell
Remove-Item Env:OUTPUT_DIR, Env:PORT -ErrorAction SilentlyContinue
```

Other static hosts can publish the contents of `dist/`. Configure any GitHub Pages custom domain in repository settings before deployment.

## Verification and limits

Root and repository-subfolder builds passed checks across 87 HTML pages and linked styles/assets. Homepage heading geometry matched the live reference at 1440, 768 and 375 pixels after font/emoji corrections. Representative mobile screens, menu keyboard handling, contact-preview feedback and guided chat were tested. A mobile blog overflow was fixed. See `docs/REFERENCE-ANALYSIS.md` for evidence and limits.

The workflow is ready but has not run on GitHub. These local changes do not modify the original live site or the earlier private review deployment. Every screen at every possible viewport has not been exhaustively verified.
