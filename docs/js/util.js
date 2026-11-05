// Small helpers shared by every page.

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Text that may contain $...$ math. Rendered by the <tex-text> element.
export const tex = (t) => `<tex-text text="${esc(t)}"></tex-text>`;

export const fmtTime = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

// Binomial pmf as an array indexed by k = 0..n.
export function pmf(n, p) {
  const a = [Math.pow(1 - p, n)];
  for (let k = 1; k <= n; k++) a[k] = a[k - 1] * ((n - k + 1) / k) * (p / (1 - p));
  return a;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return res.json();
}
