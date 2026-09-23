/* The family's values, as StyleX variables. A site overrides only --cd-accent and --cd-on-accent;
   everything else is the Atelier palette and type from cocode.dk, so the frame is literally the
   homepage's furniture. Declared here once: StyleX compiles them to CSS custom properties, which is
   what lets a site theme the frame from the outside and what lets them cross into shadow DOM. */
import * as stylex from '@stylexjs/stylex';

export const ink = stylex.defineVars({
  paper: '#ECE2CF',
  sheet: '#F6EFE0',
  ink: '#1D2130',
  quiet: '#4A4639',
  rule: '#C8BCA4',
  saffron: '#D8982C',
});

export const type = stylex.defineVars({
  serif: '"Ibarra Real Nova","Iowan Old Style","Palatino Linotype",Georgia,serif',
  sans: '"Ysabeau Office","Gill Sans","Trebuchet MS",sans-serif',
  smallCaps: '"Ysabeau SC","Ysabeau Office","Gill Sans",sans-serif',
});

export const frame = stylex.defineVars({
  /* What the site sets. The defaults are the homepage's own lapis. */
  accent: '#233E8B',
  onAccent: '#F6EFE0',
  /* What the frame paints with; a dark site flips these through the `dark` attribute. */
  bg: '#ECE2CF',
  fg: '#1D2130',
  soft: '#4A4639',
  line: '#C8BCA4',
});
