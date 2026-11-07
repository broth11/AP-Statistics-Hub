// Procedure section: worked questions (compact split layout).
// A section holds `questions`; each has an objective, the question, an optional key formula, numbered steps
// (working on the left, instruction and note on the right) and the answer in context.
// Sections that still use the retired `parts` boxes fall back to oldRender until every lesson is migrated.
import { esc, tex, fmtTime } from '../util.js';

// Stack several lines of math as one aligned block: each line is split at its first top-level "=", "\\approx"
// or "\\neq" so the relation signs line up under each other. Lines with no relation start in the aligned column.
function aligned(lines) {
  const rows = lines.map((t) => {
    const m = t.trim().replace(/^\$|\$$/g, '');
    let depth = 0, at = -1;
    for (let i = 0; i < m.length && at < 0; i++) {
      const c = m[i];
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (depth === 0 && (c === '=' || m.startsWith('\\approx', i) || m.startsWith('\\neq', i))) at = i;
    }
    return at < 0 ? '&' + m : m.slice(0, at) + '&' + m.slice(at);
  });
  return `$\\begin{aligned}${rows.join('\\\\')}\\end{aligned}$`;
}

const strip = (t) => t.trim().replace(/^\$|\$$/g, '');

const keyFormula = (f) => (f && f.length)
  ? `<div class="keyf"><div class="eyebrow">Key formula</div><div class="keyf-math">${f.map((x) => `<div>${tex(`$${strip(x)}$`)}</div>`).join('')}</div></div>`
  : '';

function stepRow(st, i) {
  const w = st.work || {};
  const lines = [].concat(w.tex || []);
  const txt = (wide) => `<div class="stxt${wide ? ' wide' : ''}"><div class="sins">${tex(st.t)}</div>${w.text ? `<div class="snote">${tex(w.text)}</div>` : ''}</div>`;
  return `<li class="sstep"><span class="snum">${i + 1}</span>${lines.length ? `<div class="smath">${tex(aligned(lines))}</div>${txt(false)}` : txt(true)}</li>`;
}

function panel(q, i) {
  return `<div class="qpanel" data-q="${i}"${i ? ' hidden' : ''}>
    <div class="qhead"><h3><span class="qn">Q${i + 1})</span>${esc(q.obj)}</h3></div>
    <div class="qtop"><div class="qtext">${tex(q.q)}</div>${keyFormula(q.formula)}</div>
    <ol class="ssteps">${q.steps.map(stepRow).join('')}</ol>
    <div class="answer"><div class="eyebrow">Answer in context</div>${tex(q.answer)}</div>
    ${q.seek != null ? `<div class="btn-row"><button class="btn btn-secondary" data-seek="${q.seek}">Watch this example (${fmtTime(q.seek)})</button></div>` : ''}
  </div>`;
}

// The question list in the side column, under the section title.
export function renderSide(sec) {
  if (!sec.questions) return '';
  return `<ol class="qlist">${sec.questions.map((q, i) => `<li><button type="button" class="qbtn" data-q="${i}" aria-expanded="${i === 0}"><span class="qn">Q${i + 1})</span><span>${esc(q.obj)}</span></button></li>`).join('')}</ol>`;
}

// Retired layout: a grid of boxes. Removed once every lesson has `questions`.
function oldRender(sec) {
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

// Every question is rendered up front (first one visible) so the math is laid out once and switching is instant.
export function render(sec) {
  if (!sec.questions) return oldRender(sec);
  const buttons = (sec.buttons || []).map((b) => `<button class="btn btn-secondary" data-seek="${b.seek}">${esc(b.label)}</button>`).join('');
  return `
    ${sec.intro ? `<div class="prose">${tex(sec.intro)}</div>` : ''}
    ${sec.questions.map(panel).join('')}
    ${buttons ? `<div class="btn-row">${buttons}</div>` : ''}`;
}

export function mount(el, sec) {
  if (!sec.questions) return {};
  const btns = [...el.closest('section').querySelectorAll('.qbtn')];
  const panels = [...el.querySelectorAll('.qpanel')];
  btns.forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.q);
    panels.forEach((p, j) => { p.hidden = j !== i; });
    btns.forEach((x, j) => x.setAttribute('aria-expanded', String(j === i)));
  }));
  return {};
}
