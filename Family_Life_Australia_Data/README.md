# Family Life in Australia: data package

Prepared 17 October 2026 for Raghav Tripathi, FIT3179 Data Visualisation 2.

Research question: How have the timing and structure of Australian family life changed across generations?

## Start here

1. Save the separate Family_Life_Australia_Master.xlsx workbook in your project folder.
2. Extract this archive into that folder. Keep the data folder name.
3. Open the workbook and read Start_Here. Review Family_Types and Living_With_Parents first.
4. Use Chart_Plan to organise the story and prepare the required hand-drawn A4 sketch.
5. Build charts in Vega-Lite/Vega from the CSV files in data. The first row is the field header and matches the corresponding workbook sheet.

The Excel workbook is the human-readable master. The CSV files are the saved chart-data snapshots for the website. They do not refresh automatically after an Excel edit. Re-export and revalidate affected CSVs after changing any data or calculation.

This package contains 14 data tables, 4,259 observations and 88 real SA4 regions, plus sources, definitions and a provisional 12-chart plan. Only load the files needed by each chart. All CSV files together are about 416 KB on disk.

## Data tables

- family_types.csv: six exclusive family categories at the 2011, 2016 and 2021 Censuses.
- partnerships.csv: social partnership status by Census year, age and sex.
- marital_status.csv: registered/legal marital status by Census year, age and sex.
- children_ever_born.csv: lifetime births reported by women by age and Census year.
- birth_trends.csv: annual birth registrations, total fertility and median parent ages, 1924-2024.
- fertility_age.csv: annual national age-specific fertility rates, 1924-2024.
- cohort_fertility.csv: completed fertility of mother birth cohorts, 1905-1975.
- marriage_trends.csv: marriage and divorce counts and consistently defined current-release rates, 2005-2025.
- marriage_indicators.csv: recent marriage ages and marriage durations, 2021-2025.
- dependent_family_size.csv: joint counts of parent arrangement and number of dependent children, 2011/2016/2021.
- living_with_parents.csv: published HILDA estimates, 2001/2012/2024.
- sa4_fertility.csv: regional births, median mother ages and three-year-average fertility rates, 2011-2024.
- sa4_families.csv: six family categories by SA4 region, 2021.
- sa4_map_data.csv: joined regional inputs for the proposed maps, with reference years explicit.

## Essential interpretation

- _pct values use a 0-100 scale. A value of 49.9 means 49.9%. Divide by 100 only when a particular chart format requires a proportion.
- _pp values are percentage-point changes, not percentage changes.
- Blank numbers mean unavailable, suppressed or not applicable. Never replace them with zero.
- HILDA changes are the publisher's unrounded-data calculations. They may differ slightly from subtraction of the displayed rounded endpoints. Retain the significance note.
- Select People OR Male/Female (or People OR Men/Women), never both. In HILDA, select All 18-29 OR the individual age bands.
- Census confidentiality adjustments mean components may not add exactly to published totals.
- Median parent ages concern all registered births, not first births. Marriage medians concern all marriages, not first marriages.
- Annual total fertility is a period measure. Completed cohort fertility concerns actual birth cohorts that have reached age 49.
- Regional fertility rates are three-year averages. The end year labels the averaging period. 2011-12 regional rates are not published; fertility-change maps use 2013-2024.
- SA4 codes use 2021 geography. Maps need matching 2021 boundary/representative-point assets, to be added in the chart-building stage.
- SA4 map inputs contain different explicit reference years: fertility 2013/2024, median mother age 2011/2024, population and births 2024, family composition 2021. Do not label all measures as 2024.
- A couple without resident children can be before parenthood or after children leave. It does not establish that the couple chose not to have children.
- Non-dependent-children-only family categories are not a substitute for all young adults living with parents.
- Alluvial diagrams may use actual joint parent-arrangement/child-count data. Their ribbons describe a snapshot, not individual families transitioning over time.
- Current-release marriage/divorce crude rates use the population aged 16+. Avoid mixing older releases with other denominators. COVID restrictions and 2021 divorce processing affect the time series.
- Same-age comparisons across Census years describe different cohorts. Observed associations alone do not establish causes.

## Provenance and assessment

Every data row has a source_id. data/sources.csv and the Sources workbook tab identify authors, publications, original download URLs, table locations, preparation steps and limitations. Definitions explains units and population meanings. ABS is the primary source, with HILDA providing a separate survey source.

The chart plan is provisional. It targets more than ten charts, at least eight advanced idioms and three different map idioms. Chart count/classification and meaningful use must be confirmed before locking the sketch. Geographic assets, Vega specifications and the webpage are not included in this data package.

Use the prior feedback throughout: consistent columns and colours, accessible contrast, purposeful spacing, unclipped charts, concise reading widths and meaningful visible annotations. Document each chart's task, rationale, marks/channels and interactions.

AI assistance was used to retrieve and prepare source tables, calculate derived fields and organise this data package. Verify the figures and acknowledge AI assistance in the final submission. Original charts and the final design must be your own work and understood for the interview.
