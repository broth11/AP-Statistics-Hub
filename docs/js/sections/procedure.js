// Procedure / formula section.
import { esc, tex } from '../util.js';

export function render(sec) {
  const parts = sec.parts.map((p) => `
    <div class="part">
      <div class="eyebrow">${esc(p.label)}</div>
      <div class="big">${tex(p.tex)}</div>
      <div class="text">${esc(p.text)}</div>
    </div>`).join('');
  const buttons = sec.buttons.map((b) => `<button class="btn btn-secondary" data-seek="${b.seek}">${esc(b.label)}</button>`).join('');
  return `
    <div class="prose">${tex(sec.intro)}</div>
    <div class="parts">${parts}</div>
    <div class="formula-line">${tex(sec.line)}</div>
    <div class="btn-row">${buttons}</div>`;
}
export function mount() {}
