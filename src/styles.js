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
    maxWidth: frame.max, marginInline: 'auto', paddingInline: frame.gutter, paddingBlock: '10px',
    display: 'flex', alignItems: 'center', gap: '16px', minHeight: '60px', flexWrap: 'wrap',
  },
  footBar: { paddingBlock: '22px', fontSize: '1rem', gap: '8px 20px', minHeight: 0 },
  wordmark: {
    fontFamily: type.serif, fontSize: '1.5rem', letterSpacing: '-.005em', color: 'inherit',
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '48px', whiteSpace: 'nowrap',
  },
  dot: { color: frame.accent, fontStyle: 'normal' },
  here: {
    fontFamily: type.smallCaps, fontWeight: 520, fontSize: '1rem', letterSpacing: '.075em',
    color: frame.soft, borderInlineStartStyle: 'solid', borderInlineStartWidth: '1px',
    borderInlineStartColor: frame.line, paddingInlineStart: '16px',
  },
  spacer: { flexGrow: 1 },
  links: { display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'wrap' },
  link: {
    fontFamily: type.smallCaps, fontWeight: 520, letterSpacing: '.06em', fontSize: '.95rem',
    color: 'inherit', textDecoration: 'none', opacity: { default: 0.82, ':hover': 1 },
    display: 'inline-flex', alignItems: 'center', minHeight: '44px', paddingInline: '10px',
  },
  linkHere: { opacity: 1, color: frame.accent },
  footLink: {
    color: 'inherit', textDecorationLine: 'underline', textDecorationThickness: '1px',
    textUnderlineOffset: '.25em', textDecorationColor: frame.line,
  },
  quiet: { color: frame.soft },
  focus: { outlineWidth: { default: 0, ':focus-visible': '2px' }, outlineStyle: 'solid',
    outlineColor: frame.accent, outlineOffset: '3px' },
});
