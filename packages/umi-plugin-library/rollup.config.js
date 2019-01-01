import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript2';
import autoNamedExports from 'rollup-plugin-auto-named-exports';
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
      json(),
      nodeResolve({
        preferBuiltins: true
      }),
      commonjs({
        include: 'node_modules/**'
      }),
      // autoNamedExports(),
      typescript({
        clean: env === 'production'
      }),
    ],
    external: Object.keys(pkg.dependencies).concat([ 'path'])
}

export default config;
