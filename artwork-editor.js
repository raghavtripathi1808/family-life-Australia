'use strict';

(() => {
  const frame = document.getElementById('website-preview');
  const select = document.getElementById('artwork-select');
  const status = document.getElementById('editor-status');
  let settings = {version: 1, artworks: {}};
  const send = message => frame.contentWindow?.postMessage(message, location.origin);

  frame.addEventListener('load', () => send({type: 'family-artwork-init'}));
  select.addEventListener('change', () => send({type: 'family-artwork-select', id: select.value}));
  for (const input of document.querySelectorAll('input[data-property]')) input.addEventListener('input', () => {
    const key = input.dataset.property;
    send({type: 'family-artwork-patch', key, value: Number(input.value) / (key === 'opacity' ? 100 : 1)});
  });
  document.getElementById('reset-artwork').addEventListener('click', () => send({type: 'family-artwork-reset'}));

  function previewDevice(mobile) {
    frame.classList.toggle('mobile', mobile);
    document.getElementById('desktop-preview').setAttribute('aria-pressed', String(!mobile));
    document.getElementById('mobile-preview').setAttribute('aria-pressed', String(mobile));
    requestAnimationFrame(() => send({type: 'family-artwork-select', id: select.value}));
  }
  document.getElementById('desktop-preview').addEventListener('click', () => previewDevice(false));
  document.getElementById('mobile-preview').addEventListener('click', () => previewDevice(true));

  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.type !== 'family-artwork-state') return;
    const message = event.data;
    for (const control of document.querySelectorAll('#artwork-select,input[data-property],#download-layout,#reset-artwork')) control.disabled = false;
    settings = message.settings;
    select.value = message.selected;
    document.getElementById('editing-device').textContent = `${message.mode === 'mobile' ? 'Mobile' : 'Desktop'} placement`;
    const item = message.values;
    if (item) {
      for (const key of ['x', 'y', 'width', 'opacity']) {
        const value = item[key] * (key === 'opacity' ? 100 : 1);
        document.getElementById(`artwork-${key}`).value = String(value);
        document.getElementById(`value-${key}`).textContent = `${value.toFixed(key === 'width' ? 0 : 1)}${key === 'width' ? ' px' : '%'}`;
      }
    }
    status.textContent = message.changed ? 'Layout saved in this browser.' : 'Ready. Drag the outlined image or use the controls.';
  });

  document.getElementById('download-layout').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(settings, null, 2) + '\n'], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'artwork-layout.json';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
