# TLC Day Care of Merrick — concept landing page

Pitch concept by East Coast Tech. Plain HTML, CSS and JavaScript, no build step.

## Run it
Open `index.html` in a browser, or deploy the folder as-is (Vercel, Netlify, GitHub Pages).
For a local server: `npx serve .` or `python3 -m http.server`.

## Structure
```
index.html          page markup, SEO meta, ChildCare schema
css/styles.css      design tokens, layout, responsive rules, animations
js/main.js          menu, call sheet, age-room tabs, timeline progress, tour form
fonts/              self-hosted Grandstander + Figtree (SIL Open Font License)
images/             original SVG illustrations, logo mark, favicon, og-image.png
```

## Notes for the pitch
- Illustrations are original artwork made for this concept. In production, pair them with TLC's real classroom photos.
- The tour form validates and shows a confirmation but does not send data yet (labelled on the page).
- "A day at TLC" times are a sample; confirm against TLC's own schedule before launch.
- Facts used: programs, ratios, hours, addresses, phones, UPK and tuition details from tlcmerrick.com; NYS OCFS license IDs (Brookside #752494, Merrick Ave #44454); Best of Long Island Best Day Care 2025 and 2026.
- Animation: one page-load moment (T, L, C blocks drop and stack, initials underline), plus motion that responds to clicks (room tabs, form). All motion is disabled under `prefers-reduced-motion`.
