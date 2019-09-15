import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy-glob";
import serve from "rollup-plugin-serve";
import liveReload from "rollup-plugin-livereload";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    file: "public/bundle.js",
    format: "iife",
    sourcemap: true
  },
  plugins: [
    copy([
      { files: 'src/*.{html,css}', dest: 'public' },
    ], { verbose: true, watch: true }),
    ...(production
      ? [
        babel({exclude: "node_modules/**"}),
        terser()
      ]
      : [
        serve("./public"),
        liveReload()
      ])
  ]
};