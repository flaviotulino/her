import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import del from "rollup-plugin-delete";

const formats = ["es", "cjs"];

export default {
  input: "src/index.js",
  output: formats.map((format) => ({
    file: `dist/index.${format}.js`,
    format,
  })),
  plugins: [
    del({
      targets: "dist/*",
    }),
    nodeResolve(),
    commonjs(),
  ],
};
