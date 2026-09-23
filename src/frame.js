/* <cocode-head> and <cocode-foot>: the furniture every cocode.dk project site shares.
 *
 * They render into shadow DOM, so a site's CSS cannot reach in and these styles cannot leak out.
 * The compiled StyleX sheet is adopted into each shadow root once and shared by every instance.
 * The site's own page is never touched.
 *
 * Without JavaScript the elements' own children remain visible, so a visitor still sees a link
 * home. With it, those children are replaced by the frame.
 */
import * as stylex from '@stylexjs/stylex';
import { frame } from './tokens.stylex.js';
import { s } from './styles.js';

const WORDS = {
  da: { by: 'Lavet af Babak Bandpey', src: 'Kildekode', fd: 'Hent på F-Droid', home: 'Alle projekter' },
  en: { by: 'Made by Babak Bandpey', src: 'Source code', fd: 'Get it on F-Droid', home: 'All projects' },
  fa: { by: 'ساختهٔ بابک بندپی', src: 'کد منبع', fd: 'دریافت از F-Droid', home: 'همهٔ پروژه‌ها' },
};
const NAMES = { da: 'Dansk', en: 'English', fa: 'فارسی', 'x-default': 'English' };

/* One sheet, built once, adopted by every shadow root. Falls back to a <link> where
   adoptedStyleSheets is missing (Safari before 16.4). */
let sheet;
function adopt(root, href) {
  if (!('adoptedStyleSheets' in Document.prototype)) {
    root.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href }));
    return;
  }
  if (!sheet) {
    sheet = new CSSStyleSheet();
    fetch(href).then((r) => r.text()).then((css) => sheet.replaceSync(css)).catch(() => {});
  }
  root.adoptedStyleSheets = [sheet];
}

/* The frame's stylesheet sits beside this module, whatever host it is served from. */
const CSS_HREF = new URL('./v1.css', import.meta.url).href;

const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (k === 'style') Object.assign(n.style, v);
    else n.setAttribute(k, v === true ? '' : v);
  }
  n.append(...kids.filter(Boolean));
  return n;
};
/* stylex.props() gives the class names (and any inline custom properties) for a set of styles. */
const sx = (...styles) => {
  const p = stylex.props(...styles);
  return { class: p.className, style: p.style };
};

class Frame extends HTMLElement {
  static observedAttributes = ['project', 'accent', 'on-accent', 'dark', 'lang', 'links', 'repo', 'fdroid', 'max'];

  connectedCallback() {
    if (!this.shadowRoot) {
      /* The children stay in the light DOM as the no-JavaScript fallback; once a shadow root
         exists they are simply no longer rendered. */
      adopt(this.attachShadow({ mode: 'open' }), CSS_HREF);
    }
    this.render();
  }

  attributeChangedCallback() { if (this.shadowRoot) this.render(); }

  get lang_() {
    const l = this.getAttribute('lang') || document.documentElement.lang || 'en';
    return WORDS[l.slice(0, 2)] ? l.slice(0, 2) : 'en';
  }

  /* The language switch is not an attribute: it differs per page, and the page already says what
     its translations are, in <link rel="alternate" hreflang>. Read it from there or show nothing. */
  alternates() {
    return [...document.querySelectorAll('link[rel="alternate"][hreflang]')]
      .map((l) => ({ code: l.getAttribute('hreflang'), href: l.href }))
      .filter((a) => a.code !== 'x-default');
  }

  /* A site's accent is data, not something StyleX can compile, so the theme rides as custom
     properties set on the host. Two things to know:
     - a StyleX variable reads as "var(--cd-xxxx)"; the property to set is the name inside it
     - setProperty is required: assigning to element.style ignores custom properties */
  theme() {
    const dark = this.hasAttribute('dark');
    const values = {
      ...(dark ? { bg: 'transparent', fg: '#F6EFE0', soft: '#B9B4A8', line: 'rgba(246,239,224,.28)' } : {}),
      ...(this.getAttribute('accent') ? { accent: this.getAttribute('accent') } : {}),
      ...(this.getAttribute('on-accent') ? { onAccent: this.getAttribute('on-accent') } : {}),
      /* The site's own column width, so the frame's edges line up with the content under it. */
      ...(this.getAttribute('max') ? { max: this.getAttribute('max') } : {}),
    };
    for (const [key, value] of Object.entries(values)) {
      const name = String(frame[key]).replace(/^var\(|\)$/g, '');
      this.style.setProperty(name, value);
    }
  }

  paint(inner, kind) {
    const host = sx(s.host, s.focus);
    this.setAttribute('class', host.class);
    Object.assign(this.style, host.style);
    this.theme();
    this.setAttribute('dir', this.lang_ === 'fa' ? 'rtl' : 'ltr');
    this.shadowRoot.replaceChildren(el('div', sx(kind === 'head' ? s.head : s.foot), inner));
  }
}

class Head extends Frame {
  render() {
    const w = WORDS[this.lang_];
    const project = this.getAttribute('project');
    const extra = (this.getAttribute('links') || '').split(',').filter(Boolean).map((pair) => {
      const [label, href] = pair.split(':').length > 2 ? [pair.slice(0, pair.indexOf(':')), pair.slice(pair.indexOf(':') + 1)] : pair.split(':');
      return el('a', { ...sx(s.link), href: href?.trim() }, label?.trim());
    });
    const langs = this.alternates().map((a) =>
      el('a', { ...sx(s.link, a.code.startsWith(this.lang_) && s.linkHere), href: a.href, hreflang: a.code,
        'aria-current': a.code.startsWith(this.lang_) ? 'true' : undefined }, NAMES[a.code] || a.code.toUpperCase()));

    this.paint(el('div', sx(s.bar),
      /* The wordmark is a name, so it stays left-to-right even on a Persian page. */
      el('a', { ...sx(s.wordmark), href: 'https://cocode.dk', title: w.home, dir: 'ltr' },
        'cocode', el('i', sx(s.dot), '.'), 'dk'),
      project && el('span', sx(s.here), project),
      el('span', sx(s.spacer)),
      el('nav', { ...sx(s.links), 'aria-label': w.home }, ...extra, ...langs),
    ), 'head');
  }
}

class Foot extends Frame {
  render() {
    const w = WORDS[this.lang_];
    const repo = this.getAttribute('repo');
    const fdroid = this.getAttribute('fdroid');
    this.paint(el('div', sx(s.bar, s.footBar),
      el('a', { ...sx(s.footLink), href: 'https://cocode.dk' }, w.by),
      el('span', sx(s.spacer)),
      repo && el('a', { ...sx(s.footLink), href: `https://github.com/${repo}` }, w.src),
      fdroid && el('a', { ...sx(s.footLink), href: `https://f-droid.org/packages/${fdroid}/` }, w.fd),
      el('span', sx(s.quiet), `© ${new Date().getFullYear()} cocode.dk`),
    ), 'foot');
  }
}

if (!customElements.get('cocode-head')) customElements.define('cocode-head', Head);
if (!customElements.get('cocode-foot')) customElements.define('cocode-foot', Foot);
