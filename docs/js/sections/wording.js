// Exam wording and traps: a two-column Weak / Better card (same card as the IB MAI Hub), video link beside the title.
import { esc, tex, fmtTime } from '../util.js';

export function render(sec) {
  const traps = sec.traps.map((t) => `
    <div class="trap">
      <div class="trap-head">
        <div><div class="eyebrow">${esc(t.kind)}</div><div class="ttitle">${tex(t.title)}</div></div>
        <button class="btn btn-ghost" data-seek="${t.seek}">Video ${fmtTime(t.seek)}</button>
      </div>
      <div class="misc-card">
        <div class="weak"><span class="eyebrow">Weak</span>${tex('“' + t.weak + '”')}</div>
        <div class="better"><span class="eyebrow">Better</span>${tex(t.better)}</div>
      </div>
    </div>`).join('');
  return `<div class="traps">${traps}</div>`;
}
export function mount() {}
