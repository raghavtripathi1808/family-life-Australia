'use strict';

// Data URLs deliberately preserve the folder already uploaded to the repository.
const DATA_DIRECTORY = 'Family_Life_Australia_Data/data/';
const chartViews = new Map();
const chartJobs = new Map();
const resourceCache = new Map();
const appState = {censusYear: 2021, selectedSex: 'People', region: '', focusYear: 2024, showPeak: true};
const censusCharts = new Set(['never-married', 'partnerships', 'family-links', 'family-types']);
const mapCharts = new Set(['fertility-map', 'births-map', 'population-map']);
let chartRegistry = [];
let regionRows = [];

function resourceText(url) {
  if (!resourceCache.has(url)) {
    resourceCache.set(url, fetch(url).then(response => {
      if (!response.ok) throw new Error(`Could not load ${url}: ${response.status}`);
      return response.text();
    }));
  }
  return resourceCache.get(url);
}

// Supply each local data resource once. The published JSON files retain real URLs.
async function hydrateData(object) {
  if (!object || typeof object !== 'object') return;
  if (typeof object.url === 'string' && !/^https?:/.test(object.url)) {
    const format = object.format || {type: object.url.endsWith('.csv') ? 'csv' : 'json'};
    object.values = vega.read(await resourceText(object.url), format);
    delete object.url;
    delete object.format;
  }
  await Promise.all(Object.entries(object).filter(([key]) => key !== 'values').map(([, value]) => hydrateData(value)));
}

function plotHeight(chart, width) {
  if (chart.id === 'population-map') return Math.round(width * .65 + 150);
  if (chart.id === 'fertility-map' || chart.id === 'births-map') return Math.max(260, Math.round(width * .69 + 45));
  if (chart.id === 'profiles' && width < 500) return 345;
  return chart.height;
}

function compactSettings(spec, chart, width) {
  if (chart.id === 'fertility' && width < 500) {
    spec.layer[4].mark.text = '2000: ages 30–34 lead';
    spec.encoding.x.axis.values = [1924, 1964, 2004, 2024];
    spec.layer[0].encoding.color.legend.values = [0, 125, 250];
    spec.layer[0].encoding.color.legend.labelOverlap = false;
    spec.config.axis.labelFontSize = 10;
  }
  if (chart.id === 'partnerships' && width < 500) {
    spec.layer[0].encoding ||= {};
    spec.encoding.color.legend.columns = 1;
    spec.encoding.color.legend.direction = 'vertical';
  }
  if (chart.id === 'births-map' && width < 600) {
    spec.layer[1].encoding.color.legend.gradientLength = 130;
    spec.layer[1].encoding.size.legend.values = [1000, 10000];
  }
  if (chart.id === 'population-map' && width < 600) {
    spec.legends[0].gradientLength = 130;
    spec.legends[1].values = [200000, 1000000];
  }
}

function setInitialSignals(spec) {
  for (const parameter of spec.params || []) if (Object.hasOwn(appState, parameter.name)) parameter.value = appState[parameter.name];
  for (const signal of spec.signals || []) if (Object.hasOwn(appState, signal.name)) signal.value = appState[signal.name];
}

function chartError(id, error) {
  const status = document.getElementById(`status-${id}`);
  status.hidden = false;
  status.classList.add('error');
  status.textContent = 'This chart could not load. Refresh the page; its data and specification are also linked below.';
  console.error(`Chart ${id}:`, error);
}

async function renderChart(chart) {
  if (chartJobs.has(chart.id)) return chartJobs.get(chart.id);
  const job = (async () => {
    const host = document.getElementById(`chart-${chart.id}`);
    const status = document.getElementById(`status-${chart.id}`);
    status.textContent = 'Loading chart…';
    try {
      const spec = JSON.parse(await resourceText(chart.src));
      await hydrateData(spec);
      const width = Math.max(250, Math.floor(host.clientWidth));
      spec.width = width;
      spec.height = plotHeight(chart, width);
      compactSettings(spec, chart, width);
      setInitialSignals(spec);
      const result = await vegaEmbed(host, spec, {mode: chart.kind, renderer: 'svg', actions: false, tooltip: true});
      const view = result.view;
      chartViews.set(chart.id, view);
      // A control may change while its chart is loading; use the latest choice.
      for (const parameter of [...(spec.params || []), ...(spec.signals || [])]) {
        if (Object.hasOwn(appState, parameter.name)) view.signal(parameter.name, appState[parameter.name]);
      }
      await view.runAsync();
      status.hidden = true;
      host.style.minHeight = '0';
      if (mapCharts.has(chart.id)) {
        view.addEventListener('click', (_event, item) => {
          const datum = item?.datum;
          const code = datum?.properties?.sa4_code_2021 || datum?.sa4_code_2021;
          if (typeof code === 'string' && regionRows.some(row => row.sa4_code_2021 === code)) selectRegion(code);
        });
      }
      let previousWidth = width;
      let animationFrame;
      const resize = () => {
        const nextWidth = Math.max(250, Math.floor(host.clientWidth));
        if (Math.abs(nextWidth - previousWidth) < 2) return;
        previousWidth = nextWidth;
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
          view.width(nextWidth).height(plotHeight(chart, nextWidth)).resize().runAsync().catch(error => chartError(chart.id, error));
        });
      };
      let observer;
      if ('ResizeObserver' in window) { observer = new ResizeObserver(resize); observer.observe(host); }
      else window.addEventListener('resize', resize);
      window.addEventListener('pagehide', () => {
        observer?.disconnect();
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrame);
        view.finalize();
      }, {once: true});
    } catch (error) { chartError(chart.id, error); }
  })();
  chartJobs.set(chart.id, job);
  return job;
}

async function updateSignal(name, value, chartIds) {
  appState[name] = value;
  await Promise.all([...chartIds].map(async id => {
    const view = chartViews.get(id);
    if (view) { try { await view.signal(name, value).runAsync(); } catch (error) { chartError(id, error); } }
  }));
}

function updateRegionSummary(code) {
  const container = document.getElementById('region-summary');
  container.replaceChildren();
  const row = regionRows.find(region => region.sa4_code_2021 === code);
  if (!row) {
    const p = document.createElement('p');
    p.textContent = 'All 88 matched regions recorded a fertility decline. Choose a region to read its figures and highlight it across the maps.';
    container.append(p);
    return;
  }
  const heading = document.createElement('h3');
  heading.textContent = `${row.sa4_name} · ${row.state_name} · SA4 ${row.sa4_code_2021}`;
  const list = document.createElement('dl');
  const fields = [
    ['Fertility, 2013 → 2024 (3-year averages)', `${row.tfr_start_3yr_average.toFixed(2)} → ${row.tfr_end_3yr_average.toFixed(2)}`],
    ['Median mother-age increase, 2011–2024', `${row.median_mother_age_change_years.toFixed(1)} years`],
    ['Registered births, 2024', row.registered_births_2024_count.toLocaleString('en-AU')],
    ['Population, 2024', row.population_2024_count.toLocaleString('en-AU')]
  ];
  for (const [label, value] of fields) {
    const group = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = value;
    group.append(dt, dd); list.append(group);
  }
  container.append(heading, list);
}

function selectRegion(code) {
  document.getElementById('region-select').value = code;
  updateRegionSummary(code);
  void updateSignal('region', code, mapCharts);
}

async function prepareRegionControl() {
  regionRows = JSON.parse(await resourceText('assets/sa4_points_2021.json'));
  const select = document.getElementById('region-select');
  const sorted = [...regionRows].sort((a, b) => a.sa4_name.localeCompare(b.sa4_name));
  select.append(...sorted.map(row => new Option(`${row.sa4_name} (${row.state_name})`, row.sa4_code_2021)));
  select.addEventListener('change', () => selectRegion(select.value));
  document.getElementById('clear-region').addEventListener('click', () => selectRegion(''));
}

async function prepareValueTable() {
  const rows = vega.read(await resourceText(DATA_DIRECTORY + 'fertility_age.csv'), {type: 'csv', parse: {year: 'number', age_min: 'number', births_per_1000_women: 'number'}});
  const select = document.getElementById('values-year');
  const years = [...new Set(rows.map(row => row.year))].sort((a, b) => b - a);
  select.replaceChildren(...years.map(year => new Option(String(year), String(year))));
  select.value = '2024';
  function update() {
    const body = document.getElementById('values-body');
    const selected = rows.filter(row => row.year === Number(select.value)).sort((a, b) => a.age_min - b.age_min);
    body.replaceChildren(...selected.map(row => {
      const tr = document.createElement('tr');
      const th = document.createElement('th'); th.scope = 'row'; th.textContent = row.age_group.replace('-', '–');
      const td = document.createElement('td'); td.textContent = row.births_per_1000_women.toFixed(1);
      tr.append(th, td); return tr;
    }));
    document.getElementById('values-caption').textContent = `Births per 1,000 women, ${select.value}`;
  }
  select.addEventListener('change', update); update();
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.vega || !window.vegaEmbed) {
    for (const element of document.querySelectorAll('.chart-host')) chartError(element.dataset.chart, new Error('Chart libraries unavailable'));
    return;
  }
  try {
    chartRegistry = JSON.parse(await resourceText('charts/registry.json'));
    document.getElementById('peak-toggle').addEventListener('change', event => void updateSignal('showPeak', event.target.checked, ['fertility']));
    document.getElementById('ridge-year').addEventListener('change', event => void updateSignal('focusYear', Number(event.target.value), ['profiles']));
    for (const select of document.querySelectorAll('.census-year')) select.addEventListener('change', event => {
      const year = Number(event.target.value);
      document.querySelectorAll('.census-year').forEach(other => { other.value = String(year); });
      document.querySelectorAll('.census-label').forEach(label => { label.textContent = String(year); });
      void updateSignal('censusYear', year, censusCharts);
    });
    document.getElementById('hilda-sex').addEventListener('change', event => {
      const sex = event.target.value;
      document.getElementById('hilda-significance').textContent = sex === 'Women'
        ? 'For women aged 26–29, the report does not mark the 2001–2024 change as statistically significant at its 10% threshold. The displayed endpoint estimates remain valid; no significant-change value is imputed.'
        : 'The report marks the three selected age-group changes as statistically significant at its 10% threshold. Published changes use unrounded estimates.';
      void updateSignal('selectedSex', sex, ['leaving-home']);
    });
    void prepareRegionControl().catch(error => console.error('Region selector:', error));
    void prepareValueTable().catch(error => console.error('Value table:', error));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          const chart = chartRegistry.find(record => record.id === entry.target.dataset.chart);
          if (chart) void renderChart(chart);
          observer.unobserve(entry.target);
        }
      }, {rootMargin: '600px 0px'});
      for (const host of document.querySelectorAll('.chart-host')) observer.observe(host);
      window.addEventListener('pagehide', () => observer.disconnect(), {once: true});
    } else for (const chart of chartRegistry) void renderChart(chart);
  } catch (error) {
    for (const chart of document.querySelectorAll('.chart-host')) chartError(chart.dataset.chart, error);
  }
});
