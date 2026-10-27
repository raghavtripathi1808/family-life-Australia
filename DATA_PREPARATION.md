# Data preparation and interpretation

## Underlying sources

The primary statistical sources are the Australian Bureau of Statistics (ABS) and the HILDA Survey report published by the Melbourne Institute. The complete source register, URLs, table locations and preparation notes are in `Family_Life_Australia_Data/data/sources.csv`. The original master workbook remains a human-readable reference for the source extracts and calculations.

- ABS Census DataPacks: national time-series tables T04 (registered marital status), T05 (social marital status), T07 (children ever born), T27 (dependent-family size); national family tables in the 2011, 2016 and 2021 profiles; 2021 SA4 family tables. Original source field names are retained in the CSVs.
- ABS Births, Australia, 2024: national annual tables; downloaded completed-cohort fertility Table 1 (`33010DC08.xlsx`); downloaded regional Table 1 (`33010DC01.xlsx`).
- ABS Marriages and Divorces, Australia, 2025: the current-release annual series and five-year indicator download.
- HILDA Statistical Report 2026, Table 11.4, printed p.154: estimates of young adults living with parents in 2001, 2012 and 2024. Published table values were extracted and visually checked against the PDF.
- ABS ASGS 2021 SA4 service: generalised boundaries (layer 1) and map points (layer 2), matched exactly to the 88 statistical region codes. https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/SA4/MapServer

## Original measurement tables

The 14 original statistical CSVs contain 4,259 aggregate observations. Their underlying values were extracted from published tables, cleaned and reshaped into one record per defined observation. Source identifiers, reference years, units and original field locators are retained. The CSVs are prepared extracts rather than untouched publisher download files. No individual or family microdata are included.

Percentages use a 0–100 scale. Percentage-point changes and percentage changes are distinct. Missing or suppressed values remain blank. Source totals are retained; confidentiality perturbation or rounding can cause small component/total differences. Select an aggregate such as `People` OR its sex components; do not add both.

## Additional derived chart tables

1. `fertility_profiles.csv` contains 35 original age-specific rates for 1964, 1984, 2004, 2014 and 2024. Age midpoints are lower age bound + 2.5 and are plotting positions for five-year groups. The annual total fertility rate is joined from `birth_trends.csv`. No rate smoothing or probability-density estimation is performed.
2. `partnership_mosaic.csv` contains 54 rows: three Census years × six broad age groups × three social partnership arrangements. Only `People` records are selected. Original five-year age-band counts are summed into 15–24, 25–34, 35–44, 45–54, 55–64 and 65+ groups. Column width is age-group count / all selected people; height is status count / age-group count. Cumulative x/y values are layout coordinates. Counts are normalised within each selected year; slight differences from percentages based on published totals can result from confidentiality adjustments.
3. `family_alluvial.csv` contains 36 rows for the original joint parent-arrangement/dependent-child counts. At each year, ribbon thickness is joint count / selected total. Equal thickness is used at both ends, with layout space reserved for node gaps. The diagram shows the same families classified two ways at one date, not observed transitions.
4. `sa4_2021.geojson` joins the 88 source regions to official 2021 boundaries. The service supplied generalised geometry with an additional 0.015-degree tolerance and four-decimal coordinate precision. Ring direction is adapted for D3 spherical geometry; tiny island/hole pieces below approximately one square kilometre are omitted from display to avoid collapsed sub-pixel geometry. Statistical values and region membership are retained.
5. `sa4_points_2021.json` joins the same measures to official ABS SA4 map points. These are representative map locations, not population-weighted centroids or addresses of births.
6. `sa4_cartogram_layout.json` starts with those points in an Australian conic equal-area projection (standard parallels −18° and −36°, central meridian 132°E). Circle radius is proportional to the square root of population. A static collision layout displaces circles while attracting them to their geographic anchor points; one uniform rescale fits the display. The final rendered circle areas remain proportional to population. Layout coordinates are a visual transformation, not new geographic measurements.

## Measures to explain accurately

- Age-specific fertility rates are registered births per 1,000 women within each age group. They include first and later births. Edge groups include births below 15 and above 49, following ABS conventions.
- Completed cohort fertility is indexed here by the mother's birth year and measured once the cohort reaches 49. The original download gives 3.10 for the 1932 cohort and 2.03 for 1975. Some ABS explanatory prose cites 2.02 for the latest cohort while its table/download gives 2.03; this draft consistently follows the downloaded Table 1. The conclusion of about two births is unchanged by that published 0.01 discrepancy.
- Annual total fertility rate is a period measure based on one year's age-specific rates. It is not the observed completed family size of today's young adults.
- Parent-age medians cover all births. They do not isolate first parenthood.
- The never-married pyramid uses counts, with age-and-sex-specific shares available in tooltips. Its shape also reflects population age structure. Never married is a legal status and includes cohabiting people.
- The social partnership mosaic uses the Census population aged 15+ who were usual residents and present in households. Its universe differs from registered-marital-status tables.
- Dependent children are under 15 or dependent full-time students aged 15–24. A family without resident children can be before parenthood or after children leave; it does not establish chosen childlessness.
- HILDA values are weighted estimates. Preserve reported significance at the publisher's 10% threshold. For women aged 26–29 the change is not marked significant; no significant-change value is imputed. Published changes use unrounded estimates and can differ from differences between printed rounded endpoints.
- Marriage and divorce rates use the current 2025 release's population aged 16+ denominator throughout. Annual divorce/marriage ratios do not measure the share of marriages ending in divorce. COVID and 2021 processing changes affect the series.
- Regional fertility is the average of calendar-year rates for the three years ending in the reference year. The comparison is 2013 versus 2024. Regional mother-age change is 2011–2024; birth counts and population are 2024. These reference periods must not be collapsed into one label.
- The 88 matched SA4 regions account for 291,330 registered births in 2024, compared with 292,318 nationally. They are the matched map universe, not every national record or non-spatial category.
- Related aggregate trends do not establish causal relationships or individual trajectories.

## Scroll-linked presentation

The parent-age opening reveals the published annual observations through the selected year, with a faint complete series retained for context. The year and age scales remain fixed. Direct labels and readouts refer to the selected observed year; no new annual ages are estimated. The fertility story outlines 1964, 1994, 2000 and 2024 while preserving every heatmap rate and the common colour scale. Scrolling and manual controls change presentation signals, not the underlying statistical tables. Reduced-motion preferences display the complete opening series by default.

## Geographic reference outline and decorative artwork

`sa4_cartogram_outline.json` contains a coastline path derived from the union of the existing matched ABS 2021 SA4 display boundaries. Interior boundaries are removed, exterior coastlines are simplified by 0.025 degrees, and islands below 0.02 square degrees are omitted from this orientation guide. The source map and regional values are unchanged. The path uses the cartogram’s original Australian conic equal-area projection and the exact affine transformation recovered from its stored `anchor_x` and `anchor_y` fields; the maximum anchor discrepancy is below 0.000001 layout units. The coastline appears in a separate geographic reference map. The original geographic anchor and displaced circle are highlighted together when a region is selected. Circles are scaled uniformly in both axes; their sizes remain proportional to population.

The family and couple silhouettes are AI-generated decorative illustrations. They represent no statistical observations and are kept behind narrative headings, outside the chart panels.

## Population dots in the current geographic map

`population_dots_2024.json` contains 1,088 illustrative dots across 88 SA4 regions. A region receives its 2024 population divided by 25,000 and rounded to the nearest integer. Together these dots represent 27,200,000 people, compared with the actual matched-region total of 27,189,375. Dot placements are visual layout coordinates, not individual records or observed residential locations.

Each regional polygon is transformed to the same Australian conic equal-area projection used by the maps. Uniform samples are drawn within that projected polygon using a separate deterministic random generator with seed `3179 + numeric SA4 code`, and then transformed back to longitude/latitude for display. The published regional totals and fertility values remain unchanged. Colour and region selection use the joined official regional data. Earlier cartogram geometry files are retained as unused source assets; the page now loads the dot-density specification.
