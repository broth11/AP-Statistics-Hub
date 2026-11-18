// Home page: choose a unit, then a lesson. Fits one screen; only the list scrolls.
import './tex-text.js';
import { esc, getJSON } from './util.js';
import { renderTopbar, watchTopbar } from './shell.js';

const STATUS = { live: 'Study page', next: 'Next', draft: 'Draft', transcript: 'Transcript only' };

function unitFromHash() {
  const m = location.hash.match(/^#unit-(\d+)$/);
  return m ? Number(m[1]) : null;
}

function lessonRow(l) {
  const live = l.status === 'live';
  const inner = `
    <span class="topic">${esc(l.topic)}</span>
    <span class="name">${esc(l.title)}</span>
    <span class="status">${STATUS[l.status] || ''}</span>`;
  return live
    ? `<a class="lesson-row is-live" href="lesson.html?v=${l.n}">${inner}</a>`
    : `<div class="lesson-row is-off">${inner}</div>`;
}

function render(site, index) {
  const unit = unitFromHash();
  const focusedUnit = document.activeElement?.dataset?.homeUnit;
  document.title = site.siteTitle;
  document.getElementById('topbar').innerHTML = renderTopbar({ site, showUnits: false });
  watchTopbar();
  const u = site.units.find((x) => x.id === unit);
  const pane = u ? `
    <div class="unit-pane">
      <div class="unit-head">
        <div class="kicker">${esc(u.kicker)}</div>
        <h2>${esc(u.name)}</h2>
      </div>
      <div class="lesson-rows">${index.lessons.filter((l) => l.unit === u.id).map(lessonRow).join('')}</div>
    </div>` : '<div class="home-prompt">Choose a unit, then a lesson</div>';
  document.getElementById('app').innerHTML = `
    <div class="home">
      <div class="home-intro">
        <h1>${esc(site.home.headline)}</h1>
        <div class="lede">${esc(site.home.lede)}</div>
        ${site.home.pilot ? `<div class="pilot">${esc(site.home.pilot)}</div>` : ''}
      </div>
      <div class="home-list">
        <nav class="home-units" aria-label="Choose a unit">
          ${site.units.filter((x) => !x.fallback).map((x) => `<button class="home-unit-btn${x.id === unit ? ' is-active' : ''}" data-home-unit="${x.id}" aria-pressed="${x.id === unit}" aria-controls="home-lessons">${esc(x.tab)}</button>`).join('')}
        </nav>
        <div class="home-lessons" id="home-lessons" aria-live="polite">${pane}</div>
        ${site.units.filter((x) => x.fallback).map((x) => `<a class="home-reviews" href="#unit-${x.id}"${x.id === unit ? ' aria-current="page"' : ''}>${esc(x.name)}</a>`).join('')}
      </div>
    </div>`;
  if (focusedUnit) document.querySelector(`[data-home-unit="${focusedUnit}"]`)?.focus({ preventScroll: true });
}

document.addEventListener('click', (e) => {
  const button = e.target.closest('[data-home-unit]');
  if (button) location.hash = `unit-${button.dataset.homeUnit}`;
});

Promise.all([getJSON('data/site.json'), getJSON('data/lessons.json')]).then(([site, index]) => {
  render(site, index);
  window.addEventListener('hashchange', () => render(site, index));
}).catch((e) => {
  document.getElementById('app').innerHTML = `<div class="error">${esc(e.message)}</div>`;
});
