import typescript from "rollup-plugin-typescript";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import path from "path";

function url() {
  return {
    name: "localserver",
    generateBundle() {
      console.log("http://localhost:10001/examples/01_basic.html");
      console.log("http://localhost:10001/examples/02_ex2.html");
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
      path.resolve("**", "**.html"),
    ],
    exclude: path.resolve("node_modules", "**", "*.js"),
    chokidar: {
      usePolling: true,
    },
  },
  plugins: [
    typescript(),
    serve(""),
    livereload(),
    url(),
  ],
};
