// Procedure / formula section.
// Each part's `tex` is one line of math, or an array of lines that are stacked on separate rows (one calculation per row).
import { esc, tex } from '../util.js';

export function render(sec) {
  const parts = (sec.parts || []).map((p) => `
    <div class="part">
      <div class="eyebrow">${esc(p.label)}</div>
      <div class="big">${[].concat(p.tex).map((t) => `<div class="calc">${tex(t)}</div>`).join('')}</div>
      <div class="text">${tex(p.text)}</div>
    </div>`).join('');
  const buttons = (sec.buttons || []).map((b) => `<button class="btn btn-secondary" data-seek="${b.seek}">${esc(b.label)}</button>`).join('');
  return `
    <div class="prose">${tex(sec.intro)}</div>
    ${(sec.steps || []).length ? `<ol class="steps">${sec.steps.map((t) => `<li>${tex(t)}</li>`).join('')}</ol>` : ''}
    ${parts ? `<div class="parts">${parts}</div>` : ''}
    ${sec.line ? `<div class="formula-line">${tex(sec.line)}</div>` : ''}
    ${buttons ? `<div class="btn-row">${buttons}</div>` : ''}`;
}
export function mount() {}
