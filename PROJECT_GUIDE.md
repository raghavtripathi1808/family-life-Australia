# Project guide: understand and review the draft

Research question: **How have the timing and structure of Australian family life changed across generations?**

This is a draft rationale and explanation guide. Review the choices and adapt the final submission description to decisions and checks you actually understand and have made. The initial implementation and wording were generated with Codex.

## How the code works

HTML (`index.html`) creates the page content and chart containers. CSS (`site.css`) defines a restrained 1080-pixel page, consistent grids, typography, spacing and narrower-screen layouts. JavaScript (`site.js`) caches source files, embeds the charts, connects controls and resizes views. Vega-Lite JSON describes marks, field encodings, scales, axes and transformations. Vega JSON provides more direct control over the ridgeline, ribbon, hierarchy and cartogram layouts. CSV files supply published statistics and transparent derived fields.

In Tableau terms, mapping `year` to the x channel is similar to placing Year on Columns. A rect mark makes cells; colour encodes a numeric rate. The rendering library reads the instructions and draws the marks. The chart specifications are readable, and the public repository and commit history can be inspected.

## Domain: who, what and why

**Who:** Readers interested in changes in Australian society, including students and a general Australian audience.

**What:** Aggregate national time series, completed birth cohorts, Census age/sex/family snapshots, HILDA living-arrangement estimates and matched SA4 regional measures. Years and denominators differ by source and are displayed explicitly.

**Why:** Identify shifts in timing, compare generations at comparable ages, distinguish legal and co-resident partnership, explore joint family arrangements, and compare geographic change under land-area and population encodings.

The four-chapter story starts with parenthood timing and completed fertility, connects partnership forms, considers family structures and the parental home, and ends with the geography of change. It avoids treating state rankings as the main analytical question.

## Chart-by-chart what / why / how

### 01. Childbirth has shifted into the thirties.

- **What:** `fertility_age.csv`; Australia · 1924–2024 · annual age-specific rates
- **Why:** Reveal a two-dimensional age-by-year pattern across a century.
- **How:** Rectangles; horizontal position = year, vertical position = age group, sequential colour = births per 1,000 women. Optional guide = highest-rate category each year.
- **Supported takeaway:** Since 2000, ages 30–34 have had the highest rate in every year through 2024.
- **Limits:** Rates include first and subsequent births. They describe each year’s population, rather than tracking the same women. Births below age 15 and above age 49 are included in the youngest and oldest groups respectively.
- **Code:** `fertility_heatmap.vl.json`

### 02. Later generations completed smaller families.

- **What:** `cohort_fertility.csv`; Women born 1905–1975 · completed fertility by age 49
- **Why:** Compare completed fertility across actual birth cohorts, while distinguishing it from annual period fertility.
- **How:** Line; x = mother’s birth year, y = completed births per woman. Direct peak and endpoint annotations.
- **Supported takeaway:** Completed fertility fell by about a third from the series peak to the latest completed cohort.
- **Limits:** The 1932 cohort averaged 3.10 births per woman; the 1975 cohort averaged 2.03. Cohorts born after 1975 are absent because they had not reached 49 by 2024.
- **Code:** `charts/cohort_fertility.vl.json`

### 03. Both mothers and fathers are older at childbirth.

- **What:** `birth_trends.csv`; Australia · 1975–2024 · median ages for all births
- **Why:** Compare the direction and size of change for mothers and fathers.
- **How:** Lines; x = registration year, y = median age, colour = parent. Direct endpoint labels.
- **Supported takeaway:** The timing shift is visible for both parents.
- **Limits:** From 1975 to 2024, mothers’ median age rose from 25.8 to 32.1; fathers’ rose from 28.6 to 33.9. These medians cover all births, including later children.
- **Code:** `charts/parent_ages.vl.json`

### 04. Later births have not fully offset lower rates at younger ages.

- **What:** `fertility_profiles.csv`; Five snapshots · shared vertical rate scale
- **Why:** Compare the shape and location of age-specific fertility profiles at selected dates.
- **How:** Vertically offset area profiles; x = age-group midpoint, height = births per 1,000 women on a common scale. Year highlighting and point tooltips.
- **Supported takeaway:** The whole profile changed: rates at older ages rose from recent lows, while rates in the twenties fell.
- **Limits:** The annual total fertility rate fell from 3.154 in 1964 to 1.481 in 2024. This is a period measure based on one year’s rates, while completed cohort fertility uses many years for one cohort. Ridges connect age-group rates and do not estimate a distribution of individual birth ages.
- **Code:** `charts/fertility_ridgeline.vg.json`

### 05. The never-married population extends beyond the twenties.

- **What:** `marital_status.csv`; Census · selected year · people aged 15+
- **Why:** Compare the age-and-sex composition of never-married people and how that composition changes across Census snapshots.
- **How:** Mirrored horizontal bars; y = age group, absolute x length = people count, side and colour = sex. Shared symmetric scale across years.
- **Supported takeaway:** Legal marital status and current living arrangements answer different questions.
- **Limits:** Among all people aged 30–34, the never-married share rose from 42.1% in 2011 to 49.5% in 2021. Never married is a legal marital status and includes people living in de facto partnerships. Counts also reflect population size and age structure.
- **Code:** `charts/never_married_pyramid.vl.json`

### 06. Partnership is increasingly separate from registered marriage.

- **What:** `partnership_mosaic.csv`; Census · selected year · current co-resident arrangements
- **Why:** Show the joint distribution of age and co-resident partnership arrangement while retaining differences in age-group size.
- **How:** Mosaic rectangles; width = age-group population, height = within-group status share, area = joint count. Consistent status colours across Census years.
- **Supported takeaway:** Some of the shift from registered marriage is towards de facto partnership, while the unpartnered share also rises.
- **Limits:** For ages 25–34, registered marriage fell from 40.6% in 2011 to 32.3% in 2021; de facto partnership rose from 19.3% to 24.5%. This table covers usual residents aged 15+ present in households, as defined by Census social marital status.
- **Code:** `charts/partnership_mosaic.vl.json`

### 07. Marriage and divorce rates have both eased.

- **What:** `marriage_trends.csv`; Australia · 2005–2025 · rates per 1,000 people aged 16+
- **Why:** Place partnership changes in the context of annual marriage and divorce rates, accounting for visible disruptions.
- **How:** Lines; x = year, y = rate per 1,000 people aged 16+, colour = event. Shaded COVID interval and direct endpoint labels.
- **Supported takeaway:** The trend concerns the frequency of annual events; it does not follow individual marriages.
- **Limits:** Marriage rates moved from 6.9 to 5.3 per 1,000 people aged 16+ between 2005 and 2025; divorce rates moved from 3.3 to 2.2. Divorce processing in 2021 also affects interpretation. Dividing these annual counts does not estimate the probability that a marriage ends in divorce.
- **Code:** `charts/marriage_divorce_rates.vl.json`

### 08. Family size differs across parent arrangements.

- **What:** `family_alluvial.csv`; Census · selected year · families with dependent children
- **Why:** Explore actual joint counts for two categorical variables and compare the joint structure across Census snapshots.
- **How:** Ribbons and nodes; thickness is proportional to family count within each year, with the total rescaled to a common height. Left node = parent arrangement, right node = dependent-child count, colour = parent arrangement.
- **Supported takeaway:** Parent arrangement and family size are related dimensions of the family population.
- **Limits:** In 2021, one dependent child accounted for 50.7% of one-parent families in this table, compared with 34.6% of registered-married couple families. Dependent children are under 15, or dependent full-time students aged 15–24. These ribbons describe a snapshot of families, not families moving between categories.
- **Code:** `charts/dependent_family_alluvial.vg.json`

### 09. Change sits alongside continuity in family types.

- **What:** `family_types.csv`; Census · selected year · six exclusive family categories
- **Why:** Show the composition of the family population and its relative stability across three Census years.
- **How:** Treemap rectangles; area = family count, colour = one of six exclusive family types. Year selection, percentage labels and full-name tooltips.
- **Supported takeaway:** The dominant family categories remain similar, even as their shares shift.
- **Limits:** Couples without resident children rose from 37.8% of families in 2011 to 38.8% in 2021; couples with dependent children moved from 36.7% to 36.0%. Couples without resident children include both those before parenthood and those whose children have left home. Census confidentiality adjustments can cause small differences between components and totals.
- **Code:** `charts/family_types_treemap.vg.json`

### 10. Living with parents has become more common.

- **What:** `living_with_parents.csv`; HILDA · 2001 and 2024 · weighted estimates
- **Why:** Compare the size and direction of endpoint changes across age groups, with an optional sex comparison.
- **How:** Slopegraph lines and endpoints; x = survey year, y = living-with-parents percentage, colour = age group. Direct labels and sex selector.
- **Supported takeaway:** The parental home remains part of adult family life for a larger share of young people.
- **Limits:** Across ages 18–29, the share living with parents rose from 39.4% in 2001 to 49.9% in 2024: a reported increase of 10.5 percentage points. Published changes use unrounded values and can differ slightly from subtraction of the displayed endpoints.
- **Code:** `charts/living_with_parents.vl.json`

### 11. Fertility declined across all 88 mapped regions.

- **What:** `sa4_map_data.csv`; SA4 regions · three-year averages ending 2013 and 2024
- **Why:** Show the spatial pattern of regional fertility change using rates rather than raw counts.
- **How:** Choropleth polygons; sequential colour = magnitude of fertility decline. Australian conic equal-area projection, tooltips and a linked region highlight.
- **Supported takeaway:** The decline is geographically widespread, with substantial variation in its size.
- **Limits:** The falls range from 0.03 to 0.66 births per woman across the matched regions. Large land areas dominate a conventional map even when their populations are small.
- **Code:** `charts/regional_fertility_map.vl.json`

### 12. Birth counts and parent ages add a different view.

- **What:** `sa4_map_data.csv`; SA4 regions · births in 2024 · mother-age change, 2011–2024
- **Why:** Combine the scale of births with change in parental age while making the two measures visually distinct.
- **How:** Circles on an equal-area map; symbol area = 2024 births, sequential colour = mother-age increase. Separate legends and a linked region highlight.
- **Supported takeaway:** Counts describe the scale of births, while the colour reveals a change in their timing.
- **Limits:** Median mother age rose by 0.5 to 2.1 years across all mapped regions. The 88 matched regions contain 291,330 registered births in 2024; the national total of 292,318 also includes records outside this matched set. Medians concern all births.
- **Code:** `charts/births_parent_age_map.vl.json`

### 13. Give people, rather than land, the visual space.

- **What:** `sa4_map_data.csv`; Dorling cartogram · circle area = 2024 population
- **Why:** Counter the land-area bias of a conventional map and reveal the pattern where population is concentrated.
- **How:** Dorling circles; area = 2024 population, colour = fertility decline, position = a collision layout attracted to projected official regional map points. Linked region highlight.
- **Supported takeaway:** Changing the geographic encoding changes which parts of the population attract attention, without changing the regional fertility values.
- **Limits:** This view makes populous urban regions more visible. Compare it with the choropleth to see how land area changes the visual impression of the same fertility declines.
- **Code:** `charts/population_cartogram.vg.json`

## Design choices to assess

- A shared grid, consistent spacing and one bounded page width address previous alignment and hierarchy feedback. Two-column chart pairs stack on smaller screens.
- Georgia headings and Arial body text separate the narrative hierarchy without using many typefaces. Review heading scale and line lengths in your browser.
- Sequential teal represents numeric magnitude in rate/change views. Sex comparisons use consistent blue/purple; partnership and family categories have explicit labels. Gold identifies guides and selected regions. The page does not depend on red/green distinction.
- Supported findings are visible in headings, endpoint labels, the 2000 annotation and explanatory notes; essential meaning is not confined to tooltips.
- Source links, units, reference years and limitations sit beside their charts. Legends are sized and arranged to fit the tested chart widths.
- The population cartogram answers a different question from the land-area map: which parts of the population become visible when region area no longer follows land area?

## Rubric coverage, without a grade guarantee

There are **13 charts** and three map types: choropleth, proportional symbols and a Dorling population cartogram. The eight advanced formats used for the draft are heatmap, ridgeline, population pyramid, mosaic, alluvial, treemap, choropleth and population cartogram. The slopegraph and proportional-symbol map are not needed to reach that advanced count.

Charts must still be effective and meaningful; counting formats alone does not secure HD. The hand-drawn sketch, narrative quality, what/why/how description and interview are also assessed. The provided assignment includes a legacy sentence about disregarding maps that conflicts with its explicit DV2 map requirement; this draft follows the explicit requirement and rubric for three map idioms.

## Hand-drawn A4 sketch: deferred until review

The sketch must be drawn by hand as required in the brief. Match the reviewed page with four clear sections:

1. Parenthood: full-width heatmap; paired cohort and parent-age lines; full-width ridgelines.
2. Partnerships: paired pyramid and mosaic, then the marriage/divorce series.
3. Family and home: full-width alluvial; paired treemap and living-with-parents slopegraph.
4. Place: shared region selector; paired conventional maps; full-width population cartogram.

Include headings, short explanations, source positions and control/legend locations. The final website should follow the submitted sketch.

## Interview preparation

Be able to explain these in your own words:

1. Why annual fertility, completed fertility and resident-child counts answer different questions.
2. What one heatmap cell means, and how the code finds the gold guide.
3. Why the pyramid uses counts, and why never married does not mean unpartnered.
4. What mosaic width, height and area each mean.
5. Why an alluvial ribbon is a classification snapshot here.
6. Why family-without-resident-children does not establish chosen childlessness.
7. What a percentage-point change means and how HILDA significance is handled.
8. Why maps use matching 2021 boundaries, three-year averages and separate reference periods.
9. What controls symbol or circle area, and what a cartogram distorts.
10. What AI generated, what you verified, and what choices you reviewed or changed.

## Before submission

Review the full published page at laptop size, test each control and check labels. Make the hand-drawn sketch, adapt the Moodle what/why/how and creation-process description, retain the original sources and this chat, and ensure the AI acknowledgement accurately reflects the final process. Do not claim personal checks or revisions that have not happened.
