import path from 'node:path';
import styleXPlugin from '@stylexjs/rollup-plugin';
import resolve from '@rollup/plugin-node-resolve';

/* StyleX compiles away: every stylex.create() call becomes atomic class names in the bundle and a
   single CSS file beside it. Nothing of StyleX ships to the visitor. */
export default {
  input: 'src/frame.js',
  output: { file: 'dist/v1.js', format: 'esm' },
  /* The visitor gets one file: StyleX's small runtime is bundled in, and everything else compiled away. */
  plugins: [resolve(), styleXPlugin({
    fileName: 'v1.css',
    classNamePrefix: 'cd-',
    unstable_moduleResolution: { type: 'commonJS', rootDir: path.resolve('.') },
  })],
};
