import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

export default commandLineArgs => {
  //console.log(commandLineArgs);
  let argsSourceMap = commandLineArgs.sourcemap === true;
  return [
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
        webWorkerLoader({
          sourcemap: argsSourceMap,
        }),
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
        webWorkerLoader({
          sourcemap: argsSourceMap,
        }),
        typescript(),
        terser(),
      ],
    },
  ];
};

