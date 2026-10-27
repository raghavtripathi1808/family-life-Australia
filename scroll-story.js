'use strict';

// Presentation controls use the published observations loaded by site.js.
(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wideScreen = window.matchMedia('(min-width: 900px) and (min-height: 720px)');
  let motionEnabled = !motionPreference.matches;
  let userSetMotion = false;
  let annualRows = new Map();
  let lastParentYear;
  let lastStoryYear;
  let signalFrame;
  let scrollFrame;
  const pendingSignals = new Map();
  let flushingSignals = false;

  // Coalesce scroll updates; never run overlapping updates on the same view.
  function queueSignal(id, name, value) {
    appState[name] = value;
    if (!pendingSignals.has(id)) pendingSignals.set(id, new Map());
    pendingSignals.get(id).set(name, value);
    if (!signalFrame && !flushingSignals) signalFrame = requestAnimationFrame(flushSignals);
  }

  async function flushSignals() {
    signalFrame = undefined;
    flushingSignals = true;
    const batch = [...pendingSignals];
    pendingSignals.clear();
    try {
      await Promise.all(batch.map(async ([id, signals]) => {
        const view = chartViews.get(id);
        if (!view) return;
        try {
          for (const [name, value] of signals) view.signal(name, value);
          await view.runAsync();
        } catch (error) { chartError(id, error); }
      }));
    } finally {
      flushingSignals = false;
      if (pendingSignals.size) signalFrame = requestAnimationFrame(flushSignals);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const navigation = document.querySelector('.chapter-nav');
    const motionButton = document.getElementById('motion-toggle');
    const track = document.getElementById('opening-track');
    const sticky = document.getElementById('opening-sticky');
    const slider = document.getElementById('parent-year');
    const follow = document.getElementById('follow-scroll');
    const steps = [...document.querySelectorAll('.story-step')];
    const yearButtons = [...document.querySelectorAll('[data-story-year]')].filter(element => element.tagName === 'BUTTON');
    const progress = document.getElementById('reading-progress');
    if (!track || !slider || !follow) return;

    function setParentYear(year, force = false) {
      year = Math.max(1975, Math.min(2024, Math.round(Number(year))));
      if (!force && year === lastParentYear) return;
      lastParentYear = year;
      slider.value = String(year);
      document.getElementById('parent-year-output').textContent = String(year);
      const row = annualRows.get(year);
      if (row) {
        const mother = row.median_mother_age_years.toFixed(1);
        const father = row.median_father_age_years.toFixed(1);
        document.getElementById('mother-age').textContent = mother;
        document.getElementById('father-age').textContent = father;
        slider.setAttribute('aria-valuetext', `${year}; mothers ${mother} years, fathers ${father} years`);
      }
      queueSignal('parent-ages', 'revealYear', year);
    }

    function setStoryYear(year, force = false) {
      year = Number(year);
      if (!force && year === lastStoryYear) return;
      lastStoryYear = year;
      for (const step of steps) step.classList.toggle('is-active', Number(step.dataset.storyYear) === year);
      for (const button of yearButtons) button.setAttribute('aria-pressed', String(Number(button.dataset.storyYear) === year));
      document.getElementById('story-year-status').textContent = `Outlined column: ${year}`;
      queueSignal('fertility', 'storyYear', year);
      queueSignal('fertility', 'storyActive', true);
    }

    function refreshScroll() {
      scrollFrame = undefined;
      const navHeight = navigation.getBoundingClientRect().height;
      root.style.setProperty('--nav-height', `${Math.ceil(navHeight)}px`);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${total > 0 ? clamp(window.scrollY / total) : 0})`;

      if (motionEnabled && wideScreen.matches && follow.checked) {
        const rect = track.getBoundingClientRect();
        const distance = Math.max(1, track.offsetHeight - sticky.offsetHeight);
        const fraction = clamp((navHeight + 18 - rect.top) / distance);
        setParentYear(1975 + fraction * 49);
      }

      const story = document.querySelector('.story-steps').getBoundingClientRect();
      const readingLine = Math.max(navHeight + 140, window.innerHeight * .48);
      if (story.top <= readingLine && story.bottom >= readingLine) {
        let active = steps[0];
        let nearest = Infinity;
        for (const step of steps) {
          const rect = step.getBoundingClientRect();
          const distance = Math.abs((rect.top + rect.bottom) / 2 - readingLine);
          if (distance < nearest) { nearest = distance; active = step; }
        }
        setStoryYear(active.dataset.storyYear);
      }

      let activeChapter;
      for (const chapter of document.querySelectorAll('main > .chapter')) {
        if (chapter.getBoundingClientRect().top <= navHeight + 130) activeChapter = chapter.id;
      }
      for (const link of navigation.querySelectorAll('a')) {
        const active = link.getAttribute('href') === `#${activeChapter}`;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }

    function scheduleScroll() {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(refreshScroll);
    }

    function applyMotion() {
      root.classList.toggle('motion-enabled', motionEnabled);
      root.classList.toggle('motion-paused', !motionEnabled);
      motionButton.setAttribute('aria-pressed', String(motionEnabled));
      motionButton.textContent = motionEnabled ? 'Motion on' : 'Motion off';
      follow.disabled = !motionEnabled || !wideScreen.matches;
      if (follow.disabled) {
        follow.checked = false;
        setParentYear(2024, true);
      }
      document.getElementById('caption-parent-ages').textContent = follow.disabled
        ? 'Drag the year control to explore the two lines. The year and age scales stay fixed. Hover or tap a visible observation to read its value.'
        : 'Scroll to trace the two lines through time, or drag the year control. The year and age scales stay fixed. Hover over the visible lines to read individual observations.';
      scheduleScroll();
      // Changing the pinning layout can change the available chart height.
      window.dispatchEvent(new Event('resize'));
    }

    slider.addEventListener('input', () => {
      follow.checked = false;
      setParentYear(slider.value);
    });
    follow.addEventListener('change', scheduleScroll);
    document.getElementById('show-parent-years').addEventListener('click', () => {
      follow.checked = false;
      setParentYear(2024);
    });
    motionButton.addEventListener('click', () => {
      userSetMotion = true;
      motionEnabled = !motionEnabled;
      if (motionEnabled && wideScreen.matches) follow.checked = true;
      applyMotion();
    });
    for (const button of yearButtons) button.addEventListener('click', () => {
      const year = Number(button.dataset.storyYear);
      setStoryYear(year);
      if (wideScreen.matches) document.getElementById(`story-${year}`).scrollIntoView({behavior: motionEnabled ? 'smooth' : 'instant', block: 'center'});
    });
    wideScreen.addEventListener('change', () => {
      if (wideScreen.matches && motionEnabled) follow.checked = true;
      applyMotion();
    });
    motionPreference.addEventListener('change', () => {
      if (userSetMotion) return;
      motionEnabled = !motionPreference.matches;
      if (motionEnabled && wideScreen.matches) follow.checked = true;
      applyMotion();
    });
    window.addEventListener('scroll', scheduleScroll, {passive: true});
    window.addEventListener('resize', scheduleScroll);
    window.addEventListener('pageshow', scheduleScroll);
    document.addEventListener('chartready', event => {
      if (event.detail.id === 'parent-ages') setParentYear(lastParentYear ?? 2024, true);
      if (event.detail.id === 'fertility') setStoryYear(lastStoryYear ?? 1964, true);
      scheduleScroll();
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }, {rootMargin: '0px 0px 20px 0px', threshold: .03});
      for (const element of document.querySelectorAll('.chapter-heading, .chapter:not(#parenthood) .chart-block, .fertility-extra, #parenthood > .chart-grid > .chart-block')) {
        element.classList.add('scroll-reveal');
        observer.observe(element);
      }
      window.addEventListener('pagehide', () => observer.disconnect(), {once: true});
    }

    applyMotion();
    setStoryYear(1964, true);
    resourceText(DATA_DIRECTORY + 'birth_trends.csv').then(text => {
      const rows = vega.read(text, {type: 'csv', parse: 'auto'});
      annualRows = new Map(rows.filter(row => row.year >= 1975).map(row => [row.year, row]));
      setParentYear(lastParentYear ?? 2024, true);
    }).catch(error => console.error('Parent-age year readout:', error));
    document.fonts?.ready.then(scheduleScroll);
    window.addEventListener('pagehide', () => {
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(signalFrame);
    }, {once: true});
  });
})();
