// "Is it binomial?" decision check: condition cards, scenario table, wording note.
import { esc, fmtTime } from '../util.js';

export function render(sec) {
  const cards = sec.cards.map((c) => `
    <div class="bits-card">
      <div class="letter">${esc(c.letter)}</div>
      <div class="name">${esc(c.name)}</div>
      <div class="text">${esc(c.text)}</div>
    </div>`).join('');
  const head = sec.columns.map((c) => `<th>${esc(c)}</th>`).join('');
  const rows = sec.rows.map((r) => `
    <tr>
      <td>${esc(r.scenario)}</td><td>${esc(r.b)}</td><td>${esc(r.i)}</td><td>${esc(r.t)}</td><td>${esc(r.s)}</td>
      <td class="verdict">${esc(r.verdict)}</td>
      <td><button class="btn btn-ghost" data-seek="${r.seek}">${fmtTime(r.seek)}</button></td>
    </tr>`).join('');
  return `
    <div class="bits-cards">${cards}</div>
    <div class="table-wrap"><table class="table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    <div class="callout"><b>${esc(sec.note.label)}</b> ${esc(sec.note.text)}</div>`;
}
export function mount() {}
