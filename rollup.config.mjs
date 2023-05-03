import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import del from "rollup-plugin-delete";

export default {
  input: "src/index.js",
  output: {
    file: `dist/index.js`,
    format: "cjs",
  },
  plugins: [
    del({
      targets: "dist/*",
    }),
    nodeResolve(),
    commonjs(),
  ],
};
