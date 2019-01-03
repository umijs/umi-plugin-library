import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-cpy';
import pkg from './package.json'

const env = process.env.NODE_ENV;

const config = {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'esm',
        }
    ],
    plugins: [
        babel({
            runtimeHelpers: true,
            plugins: [
            '@babel/plugin-transform-runtime'
            ],
            exclude: 'node_modules/**'
        }),
      json(),
      nodeResolve(),
      commonjs(),
      typescript({
        clean: env === 'production'
      }),
      copy({
        files: ["src/*.js"],
        dest: 'dist',
      })
    ],
    external: Object.keys(pkg.dependencies).concat([ 'path', 'fs', 'child_process'])
}

export default config;
