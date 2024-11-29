import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import webWorkerLoader from "rollup-plugin-web-worker-loader";
import path from "path";

function url() {
  return {
    name: "localserver",
    generateBundle() {
      console.log("http://localhost:10001/examples/index.html");
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    file: "dist/mdfmidi.js",
    format: "iife",
    name: "MdfMidi",
  },
  watch: {
    include: [
      path.resolve("**", "**.ts"),
      path.resolve("**", "**.js"),
      path.resolve("examples", "**", "**.html"),
    ],
    exclude: path.resolve("node_modules", "**", "*.js"),
    chokidar: {
      usePolling: true,
    },
  },
  plugins: [
    webWorkerLoader({
      sourcemap: true,
    }),
    typescript(),
    // terser(), // minify
    serve({
      open: true,
      openPage: '/examples/index.html'
    }),
    livereload(),
    url(),
  ],
};
