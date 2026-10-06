# Roopesh — React portfolio

React + Vite, Tailwind CSS, Motion for React and Lucide icons. Includes six shareable project dialogs, accelerator cohort and client panels, experience, team recognition, an interactive eight-stage delivery method, mobile menu, light/dark themes and the original CV.

## Run locally

Use Node 22. Run `npm ci` then `npm run dev`. Open the local URL shown in the terminal. To build, run `npm run build`; `npm run preview` previews the production output.

## GitHub Pages

1. Create `Roopesh-Bharatwaj-K-R.github.io` in your GitHub account, or another repository for a project site.
2. Upload this package's contents to the repository root on `main`, including `.github/workflows/pages.yml`, `package.json` and `package-lock.json`.
3. Under Settings → Pages select GitHub Actions as the source.
4. Run the Deploy React portfolio workflow, or push a commit to main.

Relative asset paths support both account and project sites. Case-study links use `#project-1` etc., so GitHub Pages needs no server routing fallback.

The `dist/` folder is included as a ready-built version. It can also be deployed from a separate Pages branch without installing dependencies. Use a web server to preview it; opening the HTML directly as a file can block module loading.

## Update content

Edit `src/content.json` for projects, skills, experience, clients and method steps. Edit `src/main.jsx` for the hero, education and contact details. Replace `public/Roopesh-CV.pdf` to update the CV. Styling lives in `src/styles.css`.

Content is preserved from the supplied portfolio, including the team award and cohort listings. Metrics remain scoped to the supplied claims. The original animated galaxy → Earth → Europe → Ireland → Dublin/UCD journey is restored in a React component, with start, skip, Escape and replay controls. Reduced-motion users land directly on the portfolio. Animation frames, timers and listeners are cleaned up when the component unmounts. No backend, tracking or contact-form service is required.
