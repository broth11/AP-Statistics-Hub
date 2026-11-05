// Home page: choose a unit, then a lesson. Fits one screen; only the list scrolls.
import './tex-text.js';
import { esc, getJSON } from './util.js';
import { renderTopbar } from './shell.js';

const STATUS = { live: 'Study page', next: 'Next', transcript: 'Transcript only' };

function unitFromHash() {
  const m = location.hash.match(/^#unit-(\d)$/);
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

function render(data) {
  const unit = unitFromHash();
  document.getElementById('topbar').innerHTML = renderTopbar({ units: data.units, activeUnit: unit });
  const u = data.units.find((x) => x.id === unit);
  const pane = u ? `
    <div class="unit-pane">
      <div class="unit-head">
        <div class="kicker">${esc(u.kicker)}</div>
        <h2>${esc(u.name)}</h2>
      </div>
      <div class="lesson-rows">${data.lessons.filter((l) => l.unit === u.id).map(lessonRow).join('')}</div>
    </div>` : '<div class="home-prompt">Choose a unit, then a lesson</div>';
  document.getElementById('app').innerHTML = `
    <div class="home">
      <div class="home-intro">
        <h1>Study each lesson, then jump back to the moment that explains it.</h1>
        <div class="lede">Every study page pairs the video with its key moments, a method checklist, exam wording, common traps, an interactive visual and practice questions.</div>
        <div class="pilot">Pilot: 2.10 is live. 1.13 and 3.6–3.7 are next. The other lessons are listed with their transcripts only.</div>
      </div>
      <div class="home-list">${pane}</div>
    </div>`;
}

getJSON('data/lessons.json').then((data) => {
  render(data);
  window.addEventListener('hashchange', () => render(data));
}).catch((e) => {
  document.getElementById('app').innerHTML = `<div class="error">${esc(e.message)}</div>`;
});
