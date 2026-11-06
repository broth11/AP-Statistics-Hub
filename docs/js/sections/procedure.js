// Procedure / formula section.
// Each part's `tex` is one line of math, or an array of lines shown as one aligned block (relation signs lined up).
import { esc, tex } from '../util.js';

// Stack several lines of math as one aligned block: each line is split at its first top-level "=" or "\\approx"
// so the relation signs line up under each other. Lines with no relation start in the aligned column.
function aligned(lines) {
  const rows = lines.map((t) => {
    const m = t.trim().replace(/^\$|\$$/g, '');
    let depth = 0, at = -1;
    for (let i = 0; i < m.length && at < 0; i++) {
      const c = m[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (depth === 0 && (c === '=' || m.startsWith('\\approx', i))) at = i;
    }
    return at < 0 ? '&' + m : m.slice(0, at) + '&' + m.slice(at);
  });
  return `$\\begin{aligned}${rows.join('\\\\')}\\end{aligned}$`;
}

export function render(sec) {
  const parts = (sec.parts || []).map((p) => `
    <div class="part">
      <div class="eyebrow">${esc(p.label)}</div>
      <div class="big">${Array.isArray(p.tex) && p.tex.length > 1 ? `<div class="calc">${tex(aligned(p.tex))}</div>` : [].concat(p.tex).map((t) => `<div class="calc">${tex(t)}</div>`).join('')}</div>
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
