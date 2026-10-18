# Family Life in Australia

An interactive data visualisation project by Raghav Tripathi for FIT3179 Data Visualisation 2.

**Research question: How have the timing and structure of Australian family life changed across generations?**

[View the visualisation](https://raghavtripathi1808.github.io/family-life-Australia/)

## Project overview

Thirteen charts connect changes in fertility, partnerships, family structure and living arrangements. The analysis focuses on changes in Australian society over time, with regional views providing geographic context.

The story has four chapters:

1. **Parenthood:** age-specific fertility, completed fertility across birth cohorts and parents’ ages.
2. **Partnerships:** registered marital status, co-resident partnerships, and marriage and divorce rates.
3. **Family and home:** dependent-child family arrangements, family types and young adults living with parents.
4. **Place:** regional fertility change, births, mothers’ ages and population, shown through three different map forms.

Related trends provide context for social change; they do not establish causal relationships or track individual families.

## Data and preparation

The underlying statistics come from published Australian Bureau of Statistics tables and the HILDA Survey report:

- [ABS Census DataPacks](https://www.abs.gov.au/census/find-census-data/datapacks): Census comparisons for 2011, 2016 and 2021, plus regional family data.
- [ABS Births, Australia, 2024](https://www.abs.gov.au/statistics/people/population/births-australia/2024): national fertility and parent-age series, completed-cohort fertility and regional birth measures.
- [ABS Marriages and Divorces, Australia, 2025](https://www.abs.gov.au/statistics/people/people-and-communities/marriages-and-divorces-australia/2025): annual marriage and divorce indicators.
- [HILDA Statistical Report 2026](https://melbourneinstitute.unimelb.edu.au/__data/assets/pdf_file/0011/5636288/HILDA-Statistical-Report-2026.pdf), Table 11.4: young adults living with parents.
- [ABS ASGS 2021 SA4 geographic service](https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/SA4/MapServer): regional boundaries and representative map points.

The CSV files are cleaned and reshaped extracts of published tables, with additional derived fields for comparisons and chart layouts. They are not untouched publisher downloads. Reference periods, populations and denominators vary across sources and are identified beside the charts.

See [data preparation and interpretation](DATA_PREPARATION.md), the [source register](Family_Life_Australia_Data/data/sources.csv) and [measure definitions](Family_Life_Australia_Data/data/definitions.csv) for extraction details, calculations and limitations.

## Repository structure

| File or folder | Purpose |
|---|---|
| `index.html` | Page content, chapter structure, chart containers and controls. |
| `site.css` | Typography, colours, spacing and responsive layout. |
| `site.js` | Data loading, chart embedding, shared controls and resizing. |
| `fertility_heatmap.vl.json` | Age-specific fertility heatmap specification. |
| `charts/` | Additional Vega/Vega-Lite specifications and chart registry. |
| `Family_Life_Australia_Data/data/` | Statistical extracts, derived tables and source metadata. |
| `assets/` | Regional geometry, map points and population-cartogram layout. |
| `DATA_PREPARATION.md` | Data provenance, transformations and interpretation notes. |

The site uses HTML, CSS and JavaScript with Vega, Vega-Lite and Vega-Embed. GitHub Pages serves the static files; no application server is required.

## AI acknowledgement

OpenAI ChatGPT/Codex generated the initial HTML, CSS, JavaScript, Vega/Vega-Lite specifications, layout and draft explanatory text. It also assisted with source retrieval, extraction, cleaning, restructuring, derived calculations, geographic preparation and checking. The underlying statistical observations come from the published ABS and HILDA sources listed above.
