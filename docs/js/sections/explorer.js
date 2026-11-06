// Explorer section: hands off to a module from the explorer library (docs/js/explorers/<name>.js).
// lesson.js loads the module first and passes it in ctx.explorers.
const pick = (sec, ctx) => {
  const mod = ctx.explorers[sec.explorer];
  if (!mod) throw new Error(`Unknown explorer "${sec.explorer}"`);
  return mod;
};
export const renderSide = (sec, ctx) => (pick(sec, ctx).renderSide ? pick(sec, ctx).renderSide(sec, ctx) : '');
export const render = (sec, ctx) => pick(sec, ctx).render(sec, ctx);

// Layout: chart and stat row in a main column, every control (presets, sliders, modes, buttons) in a right pane.
// The modules render their parts in a flat list; this regroups them before the module wires its events.
function regroup(el) {
  const ex = el.querySelector('.explorer');
  if (!ex || ex.querySelector('.ex-main')) return;
  const main = document.createElement('div'); main.className = 'ex-main';
  const side = document.createElement('div'); side.className = 'ex-side';
  [...ex.children].forEach((c) => {
    (c.classList.contains('ex-chart') || c.classList.contains('ex-stats') ? main : side).appendChild(c);
  });
  ex.append(main, side);
}
export const mount = (el, sec, ctx) => { regroup(el); return pick(sec, ctx).mount(el, sec, ctx); };
