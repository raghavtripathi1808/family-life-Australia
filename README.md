# Family Life in Australia — website draft

Research question: **How have the timing and structure of Australian family life changed across generations?**

Prepared for Raghav Tripathi, FIT3179 Data Visualisation 2, 19 October 2026.

This is a complete first digital draft for review, with 13 charts in four chapters. The required hand-drawn A4 sketch, final submission description and interview preparation remain separate tasks.

## Publish this update

1. Extract the website ZIP on your computer.
2. Open the extracted folder. Select its contents, including `index.html`, `site.css`, `site.js`, `charts`, `assets`, `Family_Life_Australia_Data` and the Markdown guides.
3. Open https://github.com/raghavtripathi1808/family-life-Australia/upload/main and drag that selection into the upload area. The files belong at the repository root, where the existing `index.html` is located.
4. Use the commit message `Add full family life website draft`, commit directly to `main`, and confirm the changes.
5. GitHub Pages is already configured for `main` / root. It will rebuild automatically. Allow up to 10 minutes, then refresh https://raghavtripathi1808.github.io/family-life-Australia/ . A hard refresh can help if the old page is cached.

The bundle includes the data and map assets used by the draft. The Excel workbook stays your separate reference file. Source measurements in the 14 original data tables are unchanged; the website adds derived layout tables and geographic assets.

## Understand the files

| File or folder | Purpose |
|---|---|
| `index.html` | Headings, text, chapter structure, chart containers, controls and source links. |
| `site.css` | Page width, grids, typography, colour theme, spacing and responsive layout. |
| `site.js` | Loads and caches data, embeds charts, connects controls, and handles resizing. |
| `fertility_heatmap.vl.json` | The first heatmap, retained at its original path. |
| `charts/*.vl.json` | Additional Vega-Lite chart instructions. |
| `charts/*.vg.json` | Vega instructions for ridgelines, alluvial ribbons, the treemap and cartogram. |
| `charts/registry.json` | Chart titles, files, sources and rationale used by the page loader and guide. |
| `Family_Life_Australia_Data/data` | Published-data extracts, derived chart tables, sources, definitions and current chart plan. |
| `assets` | Matched ABS 2021 boundaries and points, plus the derived cartogram layout. |
| `PROJECT_GUIDE.md` | What / why / how explanations and interview preparation for every chart. |
| `DATA_PREPARATION.md` | Source extraction, transformation, unit and geographic-layout details. |

## Interactions to check

- Switch the gold heatmap guide off and on; read exact cell values and select a year in the data table.
- Highlight different years in the ridgeline profiles.
- Change a Census year: the pyramid, mosaic, alluvial and treemap update together, including the repeated year selectors and labels.
- Change the HILDA group between all people, men and women. The significance note changes for women aged 26–29.
- Choose a region: all three maps highlight it and the summary shows its values. Clicking a region on a map also selects it. Clear the highlight to return to all regions.
- Resize the page and check that charts fit their containers and labels remain readable.

## Validation scope

The source extracts, derived calculations, code syntax, local file references and chart signals were checked. Chart specifications were compiled and rendered at 930, 480 and 300 pixel widths, with visual inspection of the rendered output. Cartogram circle area is proportional to population and collision gaps were checked after rendering. Full-page browser layout and the published deployment still need a final review after upload.

## AI contribution

OpenAI ChatGPT/Codex generated the initial page, styles, JavaScript, Vega/Vega-Lite specifications and draft text. It assisted with source retrieval, extraction, restructuring, derived calculations, map preparation and checking. Published statistics came from ABS and the HILDA report. The visible acknowledgement describes that contribution. Keep this conversation and a truthful record of any later changes and review; update the acknowledgement to match the final process.
