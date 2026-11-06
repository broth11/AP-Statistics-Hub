// <tex-text text="Plain words and $math$ together"></tex-text>
// Renders the $...$ parts with KaTeX and leaves the rest as text.
if (!customElements.get('tex-text')) {
  customElements.define('tex-text', class extends HTMLElement {
    static get observedAttributes() { return ['text']; }
    connectedCallback() { this.r(); }
    attributeChangedCallback() { this.r(); }
    r() {
      const t = this.getAttribute('text') || '';
      if (!window.katex) {
        this.textContent = t;
        clearTimeout(this._t);
        this._t = setTimeout(() => this.r(), 80);
        return;
      }
      this.textContent = '';
      t.split(/(\$[^$]+\$)/g).forEach((p) => {
        if (p.length > 2 && p[0] === '$' && p.slice(-1) === '$') {
          const s = document.createElement('span');
          try { window.katex.render(p.slice(1, -1), s, { throwOnError: false }); } catch (e) { s.textContent = p; }
          this.appendChild(s);
        } else if (p) {
          // Calculator UI tokens: {plus} {gear} {undo} {inference} are the real Desmos icons, [[Label]] is a button label, `code` is typed text.
          p.split(/(\{(?:plus|gear|undo|inference)\}|\[\[[^\]]+\]\]|`[^`]+`)/g).forEach((q) => {
            if (!q) return;
            let m;
            if ((m = q.match(/^\{(plus|gear|undo|inference)\}$/))) {
              const im = document.createElement('img');
              im.className = 'dicon'; im.alt = m[1] === 'inference' ? 'the inference (bell curve) icon' : `the ${m[1]} button`;
              im.src = `img/desmos/${m[1] === 'inference' ? 'inference-icon' : m[1]}.png`;
              this.appendChild(im);
            } else if ((m = q.match(/^\[\[([^\]]+)\]\]$/))) {
              const k = document.createElement('span'); k.className = 'ukey'; k.textContent = m[1]; this.appendChild(k);
            } else if ((m = q.match(/^`([^`]+)`$/))) {
              const c = document.createElement('code'); c.className = 'utype'; c.textContent = m[1]; this.appendChild(c);
            } else this.appendChild(document.createTextNode(q));
          });
        }
      });
    }
  });
}
