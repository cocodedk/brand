/* Every rule the frame has. StyleX compiles each declaration to its own atomic class, so two rules
   that set the same thing share one class and nothing here can collide with a site's own CSS. */
import * as stylex from '@stylexjs/stylex';
import { frame, type } from './tokens.stylex.js';

/* StyleX takes longhand only: `background`, `borderBottom` and friends are shorthands and are
   dropped without a word, which costs a debugging session if you assume otherwise. */
export const s = stylex.create({
  host: { display: 'block', fontFamily: type.sans, color: frame.fg },
  rule: { borderBottomStyle: 'double', borderBottomWidth: '3px', borderBottomColor: frame.line },
  head: { backgroundColor: frame.bg, borderBottomStyle: 'double', borderBottomWidth: '3px', borderBottomColor: frame.line },
  foot: { backgroundColor: frame.bg, borderTopStyle: 'double', borderTopWidth: '3px', borderTopColor: frame.line },
  bar: {
    /* The site's column, so the frame's edges line up with the content under it. These are plain
       custom properties, not StyleX variables: they are read here, inside the shadow root, so a site
       can set them on the elements and change them in its own media queries. border-box, because
       that is how a site measures its column. */
    boxSizing: 'border-box', maxWidth: 'var(--cocode-max, 1240px)', marginInline: 'auto',
    paddingInline: 'var(--cocode-gutter, 20px)', paddingBlock: '10px',
    display: 'flex', alignItems: 'center', gap: { default: '16px', '@media (max-width: 560px)': '10px' }, minHeight: '60px', flexWrap: 'wrap',
  },
  footBar: { paddingBlock: '10px', fontSize: '1rem', gap: '8px 20px', minHeight: 0 },
  wordmark: {
    fontFamily: type.serif, fontSize: { default: '1.5rem', '@media (max-width: 560px)': '1.3rem' }, letterSpacing: '-.005em', color: 'inherit',
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '48px', whiteSpace: 'nowrap',
  },
  dot: { color: frame.accent, fontStyle: 'normal' },
  here: {
    fontFamily: type.smallCaps, fontWeight: 520, fontSize: '1rem', letterSpacing: '.075em',
    color: frame.soft, borderInlineStartStyle: 'solid', borderInlineStartWidth: '1px',
    borderInlineStartColor: frame.line, paddingInlineStart: { default: '16px', '@media (max-width: 560px)': '10px' },
  },
  spacer: { flexGrow: 1 },
  links: { display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'wrap' },
  link: {
    fontFamily: type.smallCaps, fontWeight: 520, letterSpacing: '.06em', fontSize: '.95rem',
    color: 'inherit', textDecoration: 'none', opacity: { default: 0.82, ':hover': 1 },
    display: 'inline-flex', alignItems: 'center', minHeight: '44px', paddingInline: { default: '10px', '@media (max-width: 560px)': '7px' },
  },
  linkHere: { opacity: 1, color: frame.accent },
  /* On a phone the head has to fit one row: codes instead of names, and everything a little tighter. */
  wide: { display: { default: 'inline', '@media (max-width: 560px)': 'none' } },
  narrow: { display: { default: 'none', '@media (max-width: 560px)': 'inline' } },
  footLink: {
    /* A 44px tap target, like the head's links; the bar's own padding shrank to match. */
    display: 'inline-flex', alignItems: 'center', minHeight: '44px',
    color: 'inherit', textDecorationLine: 'underline', textDecorationThickness: '1px',
    textUnderlineOffset: '.25em', textDecorationColor: frame.line,
  },
  quiet: { color: frame.soft },
  focus: { outlineWidth: { default: 0, ':focus-visible': '2px' }, outlineStyle: 'solid',
    outlineColor: frame.accent, outlineOffset: '3px' },
});
