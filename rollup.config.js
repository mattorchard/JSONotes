import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy"


const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    file: "public/bundle.js",
    format: "iife",
    sourcemap: true
  },
  plugins: [
    copy({
      copyOnce: true,
      hook: "writeBundle",
      targets: [{src: ["src/*.html", "src/*.css"], dest: "public"}]
    }),
    production && babel({exclude: "node_modules/**"}),
    production && terser() // minify, but only in production
  ]
};