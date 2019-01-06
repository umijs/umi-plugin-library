import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import { eslint } from "rollup-plugin-eslint";
import { uglify } from "rollup-plugin-uglify";
import postcss from 'rollup-plugin-postcss';
import NpmImport from 'less-plugin-npm-import'
import json from 'rollup-plugin-json';
import external from 'rollup-plugin-peer-deps-external';
import namedDirectory from 'rollup-plugin-named-directory';
import autoprefixer from 'autoprefixer';
import pkg from './package.json'

const env = process.env.NODE_ENV;

const config = {
  input: "src/index.jsx",
  output: [
  {
    file: pkg.main,
    format: 'es',
    sourcemap: true
  }],
  watch: {
    clearScreen: false
  },
  plugins: [
    external(),
    eslint({
      include: "./src"
    }),
    postcss({
      modules: false,
      use: [['less', {
        plugins: [new NpmImport({prefix: '~'})],
        javascriptEnabled: true
      }]],
      plugins:[
        autoprefixer
      ]
    }),
    namedDirectory(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    nodeResolve({
      browser: true,
      main: true,
      jsnext: true,
      extensions: ['.js', '.jsx', '.json' ]
    }),
    commonjs(),
    json(),
  ],
  external: Object.keys(pkg.dependencies).concat(['docz'])
};

if (env === "production") {
  config.plugins.push(uglify());
}

export default config;
