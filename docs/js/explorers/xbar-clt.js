// Explorer library: sampling distribution of a sample mean (central limit theorem).
// Pick a population shape (skewed right, uniform, two-humped, or normal; every one has mean 5) and a sample size n.
// Each press draws random samples of size n and stacks the sample means into a histogram (right panel).
// The population is drawn at left. The normal model N(mu, sigma/sqrt(n)) is drawn over the histogram.
// Section config: intro, stories {key: text}, initial {pop, n, story},
//   presets [{label, sub, pop, n, story}]; pop is skew, uniform, bimodal or normal.
import { esc, tex, VB_H } from '../util.js';

const randn = () => { let u = 0, v = 0; while (!u) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const npdf = (x, m, s) => Math.exp(-(((x - m) / s) ** 2) / 2) / (s * Math.sqrt(2 * Math.PI));

// Each population has mean 5. sd is exact. draw() returns one value, pdf() the density, range is the plotted interval.
const POPS = {
  skew: { name: 'Skewed right', floor: 0, mu: 5, sd: 5, range: [0, 25], draw: () => -5 * Math.log(1 - Math.random()), pdf: (x) => (x < 0 ? 0 : Math.exp(-x / 5) / 5) },
  uniform: { name: 'Uniform', floor: 0, mu: 5, sd: 10 / Math.sqrt(12), range: [0, 10], draw: () => 10 * Math.random(), pdf: (x) => (x >= 0 && x <= 10 ? 0.1 : 0) },
  bimodal: { name: 'Two humps', mu: 5, sd: Math.sqrt(0.49 + 9), range: [0, 10],
    draw: () => (Math.random() < 0.5 ? 2 : 8) + 0.7 * randn(), pdf: (x) => 0.5 * npdf(x, 2, 0.7) + 0.5 * npdf(x, 8, 0.7) },
  normal: { name: 'Normal', mu: 5, sd: 2, range: [-1, 11], draw: () => 5 + 2 * randn(), pdf: (x) => npdf(x, 5, 2) },
};

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
  const modes = Object.entries(POPS).map(([k, v]) => `<button class="ex-mode" data-pop="${k}" aria-pressed="false">${v.name}</button>`).join('');
  return `
    <div class="explorer">
      <div class="ex-presets ex-cols-${Math.min(sec.presets.length, 4)}">${presets}</div>
      <div class="ex-sliders ex-cols-1">
        <label><span>Sample size <span data-n-label></span></span><input type="range" min="1" max="100" step="1" data-n></label>
      </div>
      <div class="ex-modes ex-cols-4">${modes}</div>
      <div class="ex-actions ex-cols-3">
        <button class="btn btn-secondary" data-one>Take 1 sample</button>
        <button class="btn btn-primary" data-many>Take 1,000 samples</button>
        <button class="btn btn-secondary" data-clear>Clear</button>
      </div>
      <div class="ex-chart"><svg viewBox="0 0 640 ${VB_H}" role="img" aria-label="Population at left and histogram of simulated sample means at right" data-chart></svg></div>
      <div class="ex-stats ex-cols-4">
        <div class="ex-stat"><div class="label">${tex('Simulated average of $\\bar x$')}</div><div class="value" data-mean></div></div>
        <div class="ex-stat"><div class="label">${tex('$\\mu_{\\bar x}=\\mu$')}</div><div class="value accent" data-mu></div></div>
        <div class="ex-stat"><div class="label">${tex('Simulated SD of $\\bar x$')}</div><div class="value" data-sd></div></div>
        <div class="ex-stat"><div class="label">${tex('$\\sigma_{\\bar x}=\\sigma/\\sqrt{n}$')}</div><div class="value accent" data-sigma></div></div>
      </div>
    </div>`;
}

export function mount(el, sec) {
  const S = { ...sec.initial, sims: [] };
  const q = (s) => el.querySelector(s);
  const nIn = q('[data-n]');
  const draw = () => { const P = POPS[S.pop]; let t = 0; for (let i = 0; i < S.n; i++) t += P.draw(); return t / S.n; };

  function paint() {
    const P = POPS[S.pop];
    const se = P.sd / Math.sqrt(S.n);
    const m = S.sims.length;
    // Population panel (left) and sampling-distribution panel (right).
    const L0 = 10, LW = 190, R0 = 250, RW = 380, base = VB_H - 55, top = 38;
    const [plo, phi] = P.range;
    const pxs = (v) => L0 + ((v - plo) / (phi - plo)) * LW;
    let pmax = 0;
    for (let i = 0; i <= 200; i++) pmax = Math.max(pmax, P.pdf(plo + ((phi - plo) * i) / 200));
    pmax = Math.min(pmax, 1.2 / P.sd) * 1.1;
    const pys = (d) => base - (Math.min(d, pmax) / pmax) * (base - top);
    let svg = `<text x="${L0}" y="24" font-size="12" font-weight="700" fill="#201e1d">Population</text>`;
    svg += `<path d="${Array.from({ length: 201 }, (_, i) => { const v = plo + ((phi - plo) * i) / 200; return `${i ? 'L' : 'M'}${pxs(v)},${pys(P.pdf(v))}`; }).join(' ')} L${pxs(phi)},${base} L${pxs(plo)},${base} Z" fill="#bab6b6" opacity="0.6" stroke="#201e1d" stroke-width="1.5"></path>`;
    svg += `<line x1="${L0}" y1="${base}" x2="${L0 + LW}" y2="${base}" stroke="#201e1d" stroke-width="2"></line>`;
    [plo, P.mu, phi].forEach((v) => {
      svg += `<line x1="${pxs(v)}" y1="${base}" x2="${pxs(v)}" y2="${base + 5}" stroke="#201e1d"></line>`;
      svg += `<text x="${pxs(v)}" y="${base + 18}" text-anchor="middle" font-size="11" fill="#201e1d">${v}</text>`;
    });
    svg += `<line x1="${pxs(P.mu)}" y1="${top - 6}" x2="${pxs(P.mu)}" y2="${base}" stroke="#ec3013" stroke-width="2"></line>`;
    svg += `<text x="${pxs(P.mu)}" y="${base + 33}" text-anchor="middle" font-size="12" font-weight="700" fill="#ae1800">μ = 5</text>`;

    // Right panel: axis centered on mu, wide enough for the model. Widen if simulated means fall outside.
    let lo = P.mu - 4.5 * se, hi = P.mu + 4.5 * se;
    if (P.floor !== undefined) lo = Math.max(lo, P.floor);
    if (S.n === 1) { lo = Math.min(lo, plo); hi = Math.max(hi, phi * 0.9); }
    if (m) { lo = Math.min(lo, ...[S.sims.reduce((a, v) => Math.min(a, v), Infinity)]); hi = Math.max(hi, S.sims.reduce((a, v) => Math.max(a, v), -Infinity)); }
    const xs = (v) => R0 + ((v - lo) / (hi - lo)) * RW;
    const mpdf = (v) => npdf(v, P.mu, se);
    let ymax = mpdf(P.mu) * 1.08;
    let bars = '';
    if (m) {
      const nb = 40, bw = (hi - lo) / nb, bins = new Array(nb).fill(0);
      S.sims.forEach((v) => { bins[Math.min(nb - 1, Math.max(0, Math.floor((v - lo) / bw)))]++; });
      const dens = bins.map((c) => c / (m * bw));
      ymax = Math.max(ymax, ...dens.map((d) => d * 1.05));
      dens.forEach((d, i) => {
        const h = (d / ymax) * (base - top);
        if (h > 0) bars += `<rect x="${xs(lo + i * bw) + 0.5}" y="${base - h}" width="${Math.max(1, xs(lo + (i + 1) * bw) - xs(lo + i * bw) - 1)}" height="${h}" fill="#bab6b6" opacity="0.8"></rect>`;
      });
    }
    const ys = (d) => base - (d / ymax) * (base - top);
    svg += `<text x="${R0}" y="24" font-size="12" font-weight="700" fill="#201e1d">Sample means (n = ${S.n})</text>`;
    svg += bars;
    svg += `<path d="${Array.from({ length: 201 }, (_, i) => { const v = lo + ((hi - lo) * i) / 200; return `${i ? 'L' : 'M'}${xs(v)},${ys(mpdf(v))}`; }).join(' ')}" fill="none" stroke="#201e1d" stroke-width="2"></path>`;
    svg += `<line x1="${R0}" y1="${base}" x2="${R0 + RW}" y2="${base}" stroke="#201e1d" stroke-width="2"></line>`;
    [-3, -2, -1, 0, 1, 2, 3].forEach((k) => {
      const v = P.mu + k * se;
      if (v < lo || v > hi) return;
      svg += `<line x1="${xs(v)}" y1="${base}" x2="${xs(v)}" y2="${base + 5}" stroke="#201e1d"></line>`;
      svg += `<text x="${xs(v)}" y="${base + 18}" text-anchor="middle" font-size="11" fill="#201e1d">${v.toFixed(2)}</text>`;
    });
    svg += `<line x1="${xs(P.mu)}" y1="${top - 6}" x2="${xs(P.mu)}" y2="${base}" stroke="#ec3013" stroke-width="2.5"></line>`;
    svg += `<text x="${xs(P.mu)}" y="${base + 33}" text-anchor="middle" font-size="12" font-weight="700" fill="#ae1800">true μ = 5</text>`;
    let mean = null, sd = null;
    if (m) {
      mean = S.sims.reduce((a, b) => a + b, 0) / m;
      sd = m > 1 ? Math.sqrt(S.sims.reduce((a, b) => a + (b - mean) ** 2, 0) / (m - 1)) : null;
      svg += `<line x1="${xs(mean)}" y1="${top - 6}" x2="${xs(mean)}" y2="${base}" stroke="#201e1d" stroke-width="2" stroke-dasharray="5 4"></line>`;
    }
    svg += `<text x="${R0 + RW}" y="12" text-anchor="end" font-size="11" fill="#605d5d">${m ? `${m.toLocaleString()} sample${m === 1 ? '' : 's'} of size ${S.n}` : 'Press a button to take samples'}</text>`;
    q('[data-chart]').innerHTML = svg;

    nIn.value = S.n;
    q('[data-n-label]').innerHTML = tex(`$n=${S.n}$`);
    el.querySelectorAll('[data-pop]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pop === S.pop)));
    q('[data-mean]').textContent = mean === null ? 'n/a' : mean.toFixed(3);
    q('[data-mu]').textContent = P.mu.toFixed(3);
    q('[data-sd]').textContent = sd === null ? 'n/a' : sd.toFixed(3);
    q('[data-sigma]').textContent = se.toFixed(3);
  }

  const clear = () => { S.sims = []; };
  nIn.addEventListener('input', () => { S.n = +nIn.value; clear(); paint(); });
  el.querySelectorAll('[data-pop]').forEach((b) => b.addEventListener('click', () => { S.pop = b.dataset.pop; clear(); paint(); }));
  q('[data-one]').addEventListener('click', () => { S.sims.push(draw()); paint(); });
  q('[data-many]').addEventListener('click', () => { for (let i = 0; i < 1000; i++) S.sims.push(draw()); paint(); });
  q('[data-clear]').addEventListener('click', () => { clear(); paint(); });
  el.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => {
    const p = sec.presets[Number(b.dataset.preset)];
    Object.assign(S, { pop: p.pop, n: p.n });
    if (p.story && sec.stories[p.story]) {
      const story = document.querySelector('#s-' + sec.id + ' [data-story]');
      if (story) story.innerHTML = tex(sec.stories[p.story]);
    }
    clear(); paint();
  }));
  paint();
}
