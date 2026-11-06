// The sticky top bar shared by the home page and the lesson pages.
// Title row: site title, a cascading Units menu (unit > lessons, with search), then on lesson pages the current lesson and
// previous / next arrows. Lesson pages add the section bar underneath.
// The bar's height is published as --hh on <html> so sticky offsets and the explorer height follow it.
import { esc } from './util.js';

const lessonLink = (l, current) => {
  const cur = l.n === current ? ' aria-current="page"' : '';
  return l.status === 'live'
    ? `<a class="um-lesson" href="lesson.html?v=${l.n}"${cur}><b>${esc(l.topic)}</b> ${esc(l.title)}</a>`
    : `<span class="um-lesson is-off"><b>${esc(l.topic)}</b> ${esc(l.title)}</span>`;
};

function menuHtml(site, lessons, activeUnit, current) {
  const units = site.units.map((u) => {
    const ls = lessons.filter((l) => l.unit === u.id);
    return `<li class="um-unit${u.id === activeUnit ? ' is-active' : ''}" data-unit="${u.id}">
      <a class="um-unit-link" href="index.html#unit-${u.id}"><span><b>${esc(u.tab)}</b><i>${esc(u.name)}</i></span><span class="um-caret" aria-hidden="true">›</span></a>
      <div class="um-sub">${ls.length ? ls.map((l) => lessonLink(l, current)).join('') : '<span class="um-lesson is-off">No lessons yet</span>'}</div>
    </li>`;
  }).join('');
  return `<div class="units-menu">
    <button class="units-btn" data-um-btn aria-expanded="false" aria-haspopup="true">Units <span aria-hidden="true">▾</span></button>
    <div class="um-panel" data-um-panel hidden>
      <input type="search" class="um-search" data-um-search placeholder="Search lessons, such as 2.11 or binomial" aria-label="Search lessons">
      <ul class="um-units" data-um-browse>${units}</ul>
      <div class="um-results" data-um-results hidden></div>
    </div>
  </div>`;
}

export function renderTopbar({ site, lessons = [], activeUnit = null, current = null, crumb = '', sections = null }) {
  const live = lessons.filter((l) => l.status === 'live').sort((a, b) => a.n - b.n);
  const i = live.findIndex((l) => l.n === current);
  const arrow = (l, sym, word) => (l
    ? `<a class="nav-arrow" href="lesson.html?v=${l.n}" aria-label="${word} lesson: ${esc(l.topic)} ${esc(l.title)}" title="${word}: ${esc(l.topic)} ${esc(l.title)}">${sym}</a>`
    : `<span class="nav-arrow is-off" aria-hidden="true">${sym}</span>`);
  const nav = i >= 0 ? `<div class="lesson-nav">${arrow(live[i - 1], '‹', 'Previous')}${arrow(live[i + 1], '›', 'Next')}</div>` : '';
  const secBar = sections ? `
    <div class="sec-bar">
      ${sections.map((s) => `<button class="sec-tab" data-sec-tab="${esc(s.id)}">${esc(s.label)}</button>`).join('')}
      <button class="btn btn-ghost toggle-all" data-toggle-all>Expand all</button>
    </div>` : '';
  return `
    <div class="topbar-row">
      <a class="site-title" href="index.html">${esc(site.siteTitle)}</a>
      ${menuHtml(site, lessons, activeUnit, current)}
      <div class="crumb">${esc(crumb)}</div>
      ${nav}
    </div>
    ${secBar}`;
}

// ---- behaviour (one set of delegated listeners, so re-rendering the bar needs no rewiring) ----
const $ = (s, r = document) => r.querySelector(s);
function setOpen(on) {
  const btn = $('[data-um-btn]'), panel = $('[data-um-panel]');
  if (!btn || !panel) return;
  panel.hidden = !on;
  btn.setAttribute('aria-expanded', String(on));
  if (on) { const s = $('[data-um-search]'); if (s) { s.value = ''; filter(''); if (matchMedia('(hover: hover)').matches) s.focus(); } }
}
function filter(q) {
  const browse = $('[data-um-browse]'), res = $('[data-um-results]');
  if (!browse || !res) return;
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) { browse.hidden = false; res.hidden = true; return; }
  const hits = [...browse.querySelectorAll('.um-lesson')].filter((a) => words.every((w) => a.textContent.toLowerCase().includes(w)));
  browse.hidden = true; res.hidden = false;
  res.innerHTML = hits.length ? hits.map((a) => a.outerHTML).join('') : '<div class="um-none">No lessons match.</div>';
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-um-btn]')) { setOpen($('[data-um-panel]').hidden); return; }
  const u = e.target.closest('.um-unit-link');
  if (u && matchMedia('(hover: none)').matches) {   // touch: first tap opens the unit's lessons, second tap follows the link
    const li = u.parentElement;
    if (!li.classList.contains('is-open')) { e.preventDefault(); document.querySelectorAll('.um-unit.is-open').forEach((x) => x.classList.remove('is-open')); li.classList.add('is-open'); }
    return;
  }
  if (!e.target.closest('.units-menu')) setOpen(false);
});
document.addEventListener('input', (e) => { if (e.target.matches('[data-um-search]')) filter(e.target.value); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setOpen(false);
  if (e.key === 'Enter' && e.target.matches('[data-um-search]')) { const a = $('[data-um-results] a.um-lesson'); if (a) location.href = a.href; }
});

// Publish the bar height so the CSS can size things below it.
export function watchTopbar() {
  const bar = document.getElementById('topbar');
  if (!bar || bar._watched) return;
  bar._watched = true;
  const set = () => document.documentElement.style.setProperty('--hh', bar.offsetHeight + 'px');
  new ResizeObserver(set).observe(bar); set();
}
