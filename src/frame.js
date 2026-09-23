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
  da: { by: 'Lavet af Babak Bandpey', src: 'Kildekode', fd: 'Hent på F-Droid', home: 'Alle projekter', langs: 'Sprog' },
  en: { by: 'Made by Babak Bandpey', src: 'Source code', fd: 'Get it on F-Droid', home: 'All projects', langs: 'Language' },
  fa: { by: 'ساختهٔ بابک بندپی', src: 'کد منبع', fd: 'دریافت از F-Droid', home: 'همهٔ پروژه‌ها', langs: 'زبان' },
};
const year = (lang) => new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR-u-ca-persian' : lang, { year: 'numeric' })
  .format(new Date()).replace(/[^\d۰-۹]/g, '');
const NAMES = { da: 'Dansk', en: 'English', fa: 'فارسی', 'x-default': 'English' };

/* One sheet, built once, adopted by every shadow root. The promise resolves once it has its rules,
   so no element draws itself unstyled. Where adoptedStyleSheets is missing (Safari before 16.4) a
   <link> inside the shadow root does the job instead. */
let sheet;
let sheetReady;
function styled(href) {
  if (!('adoptedStyleSheets' in Document.prototype)) return Promise.resolve();
  if (!sheetReady) {
    sheet = new CSSStyleSheet();
    sheetReady = fetch(href).then((r) => r.text()).then((css) => sheet.replaceSync(css)).catch(() => {});
  }
  return sheetReady;
}
function adopt(root, href) {
  if (sheet) root.adoptedStyleSheets = [sheet];
  else root.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href }));
}

/* The frame's stylesheet sits beside this module, whatever host it is served from. */
const CSS_HREF = new URL('./v1.css?v=__CSS_VERSION__', import.meta.url).href;

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
  static observedAttributes = ['project', 'accent', 'on-accent', 'dark', 'lang', 'links', 'repo', 'fdroid'];

  connectedCallback() {
    if (this.shadowRoot) { this.render(); return; }
    /* The children stay in the light DOM as the no-JavaScript fallback; once a shadow root exists
       they are no longer rendered. So the root is only attached once the styles are in, and until
       then the visitor keeps seeing the fallback rather than an unstyled frame. */
    styled(CSS_HREF).then(() => {
      if (this.shadowRoot) return;
      adopt(this.attachShadow({ mode: 'open' }), CSS_HREF);
      this.render();
    });
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
        'aria-current': a.code.startsWith(this.lang_) ? 'true' : undefined, 'aria-label': NAMES[a.code] || a.code, lang: a.code },
      /* Full names where there is room; on a phone the codes keep the head to one row. */
      el('span', sx(s.wide), NAMES[a.code] || a.code.toUpperCase()), el('span', sx(s.narrow), a.code.slice(0, 2).toUpperCase())));

    this.paint(el('div', sx(s.bar),
      /* The wordmark is a name, so it stays left-to-right even on a Persian page. */
      el('a', { ...sx(s.wordmark), href: 'https://cocode.dk', title: w.home, dir: 'ltr' },
        'cocode', el('i', sx(s.dot), '.'), 'dk'),
      project && el('span', sx(s.here), project),
      el('span', sx(s.spacer)),
      el('nav', { ...sx(s.links), 'aria-label': w.langs }, ...extra, ...langs),
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
      /* The year in the page's own calendar and digits (۱۴۰۵ on a Persian page); the line is an
         isolated left-to-right run so "© year cocode.dk" keeps its order inside right-to-left text. */
      el('span', { ...sx(s.quiet), dir: 'ltr' }, `© ${year(this.lang_)} cocode.dk`),
    ), 'foot');
  }
}

if (!customElements.get('cocode-head')) customElements.define('cocode-head', Head);
if (!customElements.get('cocode-foot')) customElements.define('cocode-foot', Foot);
