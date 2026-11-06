// Explorer library: areas and percentiles under a normal curve.
// Draw N(mu, sigma), shade P(X < a), P(X > a) or P(a < X < b), or work backward from an area to a value.
// Shows the z-score(s), the probability, and (backward) the cutoff x = mu + z*sigma.
// Section config: intro, stories {key: text}, initial {mu, sigma, mode, a, b, p, story},
//   presets [{label, sub, mu, sigma, mode, a, b, p, story}], range {muMin, muMax, muStep, sdMin, sdMax, sdStep}.
//   mode is left, right, between or inv. a and b are values of X, p is the area to the left for inv.
import { esc, tex, normalCdf, normalInv, VB_H } from '../util.js';

const MODES = [['left', '$P(X<a)$'], ['right', '$P(X>a)$'], ['between', '$P(a<X<b)$'], ['inv', 'Area $\\to$ value']];

export function renderSide(sec) {
  return `
    <div class="side-copy">${tex(sec.intro)}</div>
    <div class="side-story">
      <div class="kicker">Story</div>
      <div class="text" data-story>${tex(sec.stories[sec.initial.story])}</div>
    </div>`;
}

export function render(sec) {
  const presets = sec.presets.map((p, i) =>
    `<button class="btn btn-secondary" data-preset="${i}"><span>${esc(p.label)}</span>${tex(p.sub)}</button>`).join('');
  const modes = MODES.map(([m, label]) => `<button class="ex-mode" data-mode="${m}" aria-pressed="false">${tex(label)}</button>`).join('');
  const r = sec.range;
  return `
    <div class="explorer">
      <div class="ex-presets ex-cols-${Math.min(sec.presets.length, 4)}">${presets}</div>
      <div class="ex-sliders ex-cols-3">
        <label><span>Mean <span data-mu-label></span></span><input type="range" min="${r.muMin}" max="${r.muMax}" step="${r.muStep}" data-mu></label>
        <label><span>Standard deviation <span data-sd-label></span></span><input type="range" min="${r.sdMin}" max="${r.sdMax}" step="${r.sdStep}" data-sd></label>
        <label><span data-a-name>Value a</span> <span data-a-label></span><input type="range" step="any" data-a></label>
        <label data-b-wrap><span>Value b <span data-b-label></span></span><input type="range" step="any" data-b></label>
        <label data-p-wrap><span>Area to the left <span data-p-label></span></span><input type="range" min="0.01" max="0.99" step="0.01" data-p></label>
      </div>
      <div class="ex-modes ex-cols-4">${modes}</div>
      <div class="ex-chart"><svg viewBox="0 0 640 ${VB_H}" role="img" aria-label="Normal curve with the chosen area shaded" data-chart></svg></div>
      <div class="ex-stats ex-cols-3">
        <div class="ex-stat"><div class="label" data-z-label></div><div class="value" data-z></div></div>
        <div class="ex-stat"><div class="label" data-event></div><div class="value accent" data-prob></div></div>
        <div class="ex-stat"><div class="label" data-x-label></div><div class="value" data-x></div></div>
      </div>
    </div>`;
}

export function mount(el, sec) {
  const S = { ...sec.initial };
  const q = (s) => el.querySelector(s);
  const muIn = q('[data-mu]'), sdIn = q('[data-sd]'), aIn = q('[data-a]'), bIn = q('[data-b]'), pIn = q('[data-p]');
  const fmt = (v) => String(+(Math.abs(v) >= 100 ? v.toFixed(1) : Math.abs(v) >= 10 ? v.toFixed(2) : v.toFixed(3)));
  const f2 = (v) => v.toFixed(3);

  function paint() {
    const { mu, sigma, mode } = S;
    const lo = mu - 4 * sigma, hi = mu + 4 * sigma;
    // Sliders for a and b always span mu - 4 sigma to mu + 4 sigma.
    for (const [inp, key] of [[aIn, 'a'], [bIn, 'b']]) {
      inp.min = lo; inp.max = hi; inp.step = sigma / 50;
      S[key] = Math.min(hi, Math.max(lo, S[key]));
      inp.value = S[key];
    }
    if (S.b < S.a) S.b = S.a;
    bIn.value = S.b;
    const za = (S.a - mu) / sigma, zb = (S.b - mu) / sigma;
    let from = null, to = null, prob, zText, xText, event, zLab, xLab;
    const pdf = (v) => Math.exp(-(((v - mu) / sigma) ** 2) / 2) / (sigma * Math.sqrt(2 * Math.PI));
    if (mode === 'left') { from = -Infinity; to = S.a; prob = normalCdf(za); }
    else if (mode === 'right') { from = S.a; to = Infinity; prob = 1 - normalCdf(za); }
    else if (mode === 'between') { from = S.a; to = S.b; prob = normalCdf(zb) - normalCdf(za); }
    else { const z = normalInv(S.p); from = -Infinity; to = mu + z * sigma; prob = S.p; }
    if (mode === 'inv') {
      const z = normalInv(S.p);
      zText = f2(z); xText = fmt(mu + z * sigma);
      event = `$P(X<x)=${S.p.toFixed(2)}$`;
      zLab = '$z$ with that area to its left';
      xLab = '$x=\\mu+z\\sigma$';
    } else if (mode === 'between') {
      zText = `${f2(za)} to ${f2(zb)}`; xText = `${fmt(S.a)} to ${fmt(S.b)}`;
      event = `$P(${fmt(S.a)}<X<${fmt(S.b)})$`;
      zLab = '$z=\\dfrac{x-\\mu}{\\sigma}$';
      xLab = 'Interval';
    } else {
      zText = f2(za); xText = fmt(S.a);
      event = mode === 'left' ? `$P(X<${fmt(S.a)})$` : `$P(X>${fmt(S.a)})$`;
      zLab = '$z=\\dfrac{x-\\mu}{\\sigma}$';
      xLab = 'Value $x$';
    }
    const X0 = 20, W = 600, base = VB_H - 50, top = 30;
    const xs = (v) => X0 + ((v - lo) / (hi - lo)) * W;
    const ymax = pdf(mu) * 1.1;
    const ys = (v) => base - (pdf(v) / ymax) * (base - top);
    const N = 240;
    const pts = [];
    for (let i = 0; i <= N; i++) { const v = lo + ((hi - lo) * i) / N; pts.push([v, ys(v)]); }
    let svg = '';
    const f = Math.max(lo, from), t = Math.min(hi, to);
    if (t > f) {
      const seg = pts.filter(([v]) => v >= f && v <= t);
      const startY = ys(f), endY = ys(t);
      const d = `M${xs(f)},${base} L${xs(f)},${startY} ${seg.map(([v, y]) => `L${xs(v)},${y}`).join(' ')} L${xs(t)},${endY} L${xs(t)},${base} Z`;
      svg += `<path d="${d}" fill="#ec3013" opacity="0.8"></path>`;
    }
    svg += `<path d="${pts.map(([v, y], i) => `${i ? 'L' : 'M'}${xs(v)},${y}`).join(' ')}" fill="none" stroke="#201e1d" stroke-width="2"></path>`;
    svg += `<line x1="${X0}" y1="${base}" x2="${X0 + W}" y2="${base}" stroke="#201e1d" stroke-width="2"></line>`;
    for (let k = -3; k <= 3; k++) {
      const v = mu + k * sigma;
      svg += `<line x1="${xs(v)}" y1="${base}" x2="${xs(v)}" y2="${base + 5}" stroke="#201e1d"></line>`;
      svg += `<text x="${xs(v)}" y="${base + 18}" text-anchor="middle" font-size="11" fill="#201e1d">${fmt(v)}</text>`;
      svg += `<text x="${xs(v)}" y="${base + 32}" text-anchor="middle" font-size="10" fill="#605d5d">z = ${k}</text>`;
    }
    const edges = mode === 'inv' ? [to] : mode === 'between' ? [S.a, S.b] : [S.a];
    edges.forEach((v) => {
      svg += `<line x1="${xs(v)}" y1="${top - 6}" x2="${xs(v)}" y2="${base}" stroke="#201e1d" stroke-width="2" stroke-dasharray="5 4"></line>`;
    });
    svg += `<text x="${X0}" y="16" font-size="12" fill="#201e1d">Normal model with mean ${fmt(mu)} and SD ${fmt(sigma)}. The shaded area is the probability.</text>`;
    q('[data-chart]').innerHTML = svg;

    q('[data-mu-label]').innerHTML = tex(`$\\mu=${fmt(mu)}$`);
    q('[data-sd-label]').innerHTML = tex(`$\\sigma=${fmt(sigma)}$`);
    q('[data-a-name]').textContent = 'Value a';
    q('[data-a-label]').innerHTML = tex(`$a=${fmt(S.a)}$`);
    q('[data-b-label]').innerHTML = tex(`$b=${fmt(S.b)}$`);
    q('[data-p-label]').innerHTML = tex(`$${S.p.toFixed(2)}$`);
    q('[data-a-label]').closest('label').style.display = mode === 'inv' ? 'none' : '';
    q('[data-b-wrap]').style.display = mode === 'between' ? '' : 'none';
    q('[data-p-wrap]').style.display = mode === 'inv' ? '' : 'none';
    muIn.value = mu; sdIn.value = sigma; pIn.value = S.p;
    el.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    q('[data-z-label]').innerHTML = tex(zLab);
    q('[data-x-label]').innerHTML = tex(xLab);
    q('[data-event]').innerHTML = tex(event);
    q('[data-z]').textContent = zText;
    q('[data-prob]').textContent = prob.toFixed(4);
    q('[data-x]').textContent = xText;
    const small = mode === 'between';
    q('[data-z]').classList.toggle('small', small);
    q('[data-x]').classList.toggle('small', small);
  }

  muIn.addEventListener('input', () => { const d = +muIn.value - S.mu; S.mu = +muIn.value; S.a += d; S.b += d; paint(); });
  sdIn.addEventListener('input', () => {
    const za = (S.a - S.mu) / S.sigma, zb = (S.b - S.mu) / S.sigma;
    S.sigma = +sdIn.value; S.a = S.mu + za * S.sigma; S.b = S.mu + zb * S.sigma; paint();
  });
  aIn.addEventListener('input', () => { S.a = +aIn.value; paint(); });
  bIn.addEventListener('input', () => { S.b = +bIn.value; paint(); });
  pIn.addEventListener('input', () => { S.p = +pIn.value; paint(); });
  el.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => { S.mode = b.dataset.mode; paint(); }));
  el.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => {
    const p = sec.presets[Number(b.dataset.preset)];
    Object.assign(S, { mu: p.mu, sigma: p.sigma, mode: p.mode, a: p.a, b: p.b === undefined ? p.a : p.b, p: p.p === undefined ? S.p : p.p });
    if (p.story && sec.stories[p.story]) {
      const story = document.querySelector('#s-' + sec.id + ' [data-story]');
      if (story) story.innerHTML = tex(sec.stories[p.story]);
    }
    paint();
  }));
  if (S.b === undefined) S.b = S.a;
  paint();
}
