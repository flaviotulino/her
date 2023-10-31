import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  plugins: [
    json(),
    del({
      targets: "dist/*",
    }),
    nodeResolve(),
    commonjs(),
    copy({
      targets: [
        {
          src: "src/index.d.ts",
          dest: "dist",
        },
      ],
    }),
  ],
};
