import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

export default {
  input: "src/main.js", // webpack entry
  output: {
    // webpack output
    file: "dist/bundle.js", // output filename
    format: "cjs", // common.js   module.exports = ?
    exports: "default",
  },
  plugins: [
    resolve(),
    babel({ // babel-loader
      presets: ["@babel/preset-env"],
      exclude: "node_modules/**", // 只编译我们的源代码
    }),
  ],
};
