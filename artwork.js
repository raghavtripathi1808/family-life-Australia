'use strict';

// Artwork settings are separate from the statistical charts.
(() => {
  const identifiers = ['hero', 'partnerships', 'home'];
  const storageKey = 'family-life-artwork-layout-v1';
  const editorMode = new URLSearchParams(location.search).get('artworkEditor') === '1';
  const limit = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  let settings = {version: 1, artworks: {}};
  let selected = 'hero';
  let images = [];
  let loaded = false;
  let overlay;
  let drag;

  function clean(raw) {
    const result = {version: 1, artworks: {}};
    for (const id of identifiers) {
      for (const mode of ['desktop', 'mobile']) {
        const item = raw?.artworks?.[id]?.[mode];
        if (!item || !['x', 'y', 'width', 'height', 'opacity'].every(key => Number.isFinite(item[key]))) continue;
        result.artworks[id] ||= {};
        result.artworks[id][mode] = {
          x: limit(item.x, -50, 150), y: limit(item.y, -100, 200),
          width: limit(item.width, 60, 1600), height: limit(item.height, 40, 1200),
          opacity: limit(item.opacity, 0, .4)
        };
      }
    }
    return result;
  }

  const device = () => window.innerWidth <= 760 ? 'mobile' : 'desktop';
  const currentImage = () => images.find(image => image.dataset.artwork === selected);

  function measurements(image = currentImage()) {
    if (!image) return null;
    const box = image.getBoundingClientRect();
    const parent = image.parentElement.getBoundingClientRect();
    return {
      x: (box.left - parent.left + box.width / 2) / parent.width * 100,
      y: (box.top - parent.top + box.height / 2) / parent.height * 100,
      width: box.width, height: box.height,
      opacity: Number(getComputedStyle(image).opacity)
    };
  }

  function notify(changed = false) {
    if (!editorMode || parent === window || !loaded) return;
    parent.postMessage({type: 'family-artwork-state', settings, selected, mode: device(), values: measurements(), changed}, location.origin);
  }

  function positionOverlay() {
    if (!editorMode || !overlay) return;
    const image = currentImage();
    if (!image) return;
    if (overlay.parentElement !== image.parentElement) image.parentElement.append(overlay);
    const box = image.getBoundingClientRect();
    const parentBox = image.parentElement.getBoundingClientRect();
    Object.assign(overlay.style, {
      left: `${box.left - parentBox.left}px`, top: `${box.top - parentBox.top}px`,
      width: `${box.width}px`, height: `${box.height}px`
    });
  }

  function apply() {
    for (const image of images) {
      image.removeAttribute('style');
      image.classList.toggle('artwork-selected', editorMode && image.dataset.artwork === selected);
      const item = settings.artworks[image.dataset.artwork]?.[device()];
      if (item) Object.assign(image.style, {
        left: `${item.x}%`, top: `${item.y}%`, right: 'auto', bottom: 'auto',
        width: `${item.width}px`, height: `${item.height}px`, maxWidth: 'none',
        opacity: String(item.opacity), transform: 'translate(-50%, -50%)'
      });
    }
    positionOverlay();
  }

  function save(item) {
    settings.artworks[selected] ||= {};
    settings.artworks[selected][device()] = item;
    settings = clean(settings);
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch (_) { /* Export still works if local storage is unavailable. */ }
    apply();
    notify(true);
  }

  function choose(id, scroll = true) {
    if (!identifiers.includes(id)) return;
    selected = id;
    apply();
    if (scroll) currentImage()?.parentElement.scrollIntoView({block: 'center', behavior: 'instant'});
    positionOverlay();
    notify();
  }

  function beginDrag(event, resize) {
    if (event.button !== 0) return;
    if (!resize) selected = event.currentTarget.dataset.artwork;
    event.preventDefault();
    event.stopPropagation();
    const image = currentImage();
    drag = {resize, pointer: event.pointerId, x: event.clientX, y: event.clientY,
      values: measurements(image), parent: image.parentElement.getBoundingClientRect()};
    event.currentTarget.setPointerCapture(event.pointerId);
    apply();
    notify();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    images = [...document.querySelectorAll('img[data-artwork]')];
    if (editorMode) {
      document.documentElement.classList.add('artwork-editing');
      overlay = document.createElement('div');
      overlay.className = 'artwork-selection-box';
      const handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'artwork-resize-handle';
      handle.setAttribute('aria-label', 'Resize selected silhouette');
      handle.title = 'Drag this corner to resize';
      overlay.append(handle);
      handle.addEventListener('pointerdown', event => beginDrag(event, true));
      for (const image of images) {
        image.draggable = false;
        image.addEventListener('pointerdown', event => beginDrag(event, false));
      }
      document.addEventListener('pointermove', event => {
        if (!drag || event.pointerId !== drag.pointer) return;
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        const item = {...drag.values};
        if (drag.resize) {
          const ratio = item.height / item.width;
          const change = Math.abs(dx) > Math.abs(dy / ratio) ? dx : dy / ratio;
          const width = limit(item.width + change, 60, 1600);
          const height = width * ratio;
          item.x += (width - item.width) / 2 / drag.parent.width * 100;
          item.y += (height - item.height) / 2 / drag.parent.height * 100;
          item.width = width; item.height = height;
        } else {
          item.x += dx / drag.parent.width * 100;
          item.y += dy / drag.parent.height * 100;
        }
        save(item);
      });
      document.addEventListener('pointerup', () => { drag = null; });
      document.addEventListener('pointercancel', () => { drag = null; });
    }
    try {
      const response = await fetch('assets/artwork-layout.json', {cache: 'no-store'});
      if (response.ok) settings = clean(await response.json());
    } catch (_) { /* The CSS placements remain a usable fallback. */ }
    try {
      const draft = localStorage.getItem(storageKey);
      if (draft) settings = clean(JSON.parse(draft));
    } catch (_) { /* Ignore an unreadable local draft. */ }
    loaded = true;
    apply();
    notify();
  });

  window.addEventListener('message', event => {
    if (!editorMode || event.origin !== location.origin || event.source !== parent || !loaded) return;
    const message = event.data;
    if (message?.type === 'family-artwork-select') choose(message.id);
    if (message?.type === 'family-artwork-init') choose(selected);
    if (message?.type === 'family-artwork-patch') {
      const item = measurements();
      if (!item || !Number.isFinite(message.value)) return;
      if (message.key === 'width') {
        const ratio = item.height / item.width;
        item.width = message.value; item.height = item.width * ratio;
      } else if (['x', 'y', 'opacity'].includes(message.key)) item[message.key] = message.value;
      save(item);
    }
    if (message?.type === 'family-artwork-reset') {
      if (settings.artworks[selected]) delete settings.artworks[selected][device()];
      try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch (_) {}
      apply(); notify(true);
    }
  });

  window.addEventListener('resize', () => { if (loaded) { apply(); notify(); } });
  window.addEventListener('scroll', positionOverlay, {passive: true});
  window.addEventListener('storage', event => {
    if (event.key !== storageKey || !loaded) return;
    try { settings = clean(JSON.parse(event.newValue || '{}')); apply(); notify(); } catch (_) {}
  });
})();
