import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/main.ts",
    output: [
      {
        file: "dist/mdfmidi.js",
        format: "iife",
        name: "MdfMidi",
      },
      {
        file: "dist/mdfmidi.cjs.js",
        format: "cjs",
        name: "MdfMidi",
        exports: "default",
      },
      {
        file: "dist/mdfmidi.es.js",
        format: "es",
        name: "MdfMidi",
      },
      {
        file: "dist/mdfmidi.umd.js",
        format: "umd",
        name: "MdfMidi",
      },
      {
        file: "dist/mdfmidi.amd.js",
        format: "amd",
        name: "MdfMidi",
      },
    ],
    plugins: [
      typescript(),
    ],
  },
  {
    input: "src/main.ts",
    output: [
      {
        file: "dist/mdfmidi.min.js",
        format: "iife",
        name: "MdfMidi",
      },
      {
        file: "dist/mdfmidi.umd.min.js",
        format: "umd",
        name: "MdfMidi",
      },
    ],
    plugins: [
      typescript(),
      terser(),
    ],
  },
];
