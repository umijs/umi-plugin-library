import { rollup, RollupOptions, OutputOptions, RollupWarning, Plugin } from 'rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import NpmImport from 'less-plugin-npm-import';
import umiBabel from 'babel-preset-umi';
import alias from 'rollup-plugin-alias';
import autoNamedExports from 'rollup-plugin-auto-named-exports';
import peerExternal from 'rollup-plugin-peer-deps-external';
import { uglify } from 'rollup-plugin-uglify';
import autoprefixer from 'autoprefixer';
import camelCase from 'camelcase';
import { IApi, IBundleOptions, IStringObject, IPkg } from '..';
import { join, basename } from 'path';

export interface IInputOptions extends RollupOptions {
  external: string[];
  plugins: Plugin[];
}

export type BundleType = 'umd' | 'cjs' | 'esm';

// OutputOptions type bug
export interface IOutputOptions extends OutputOptions {
  format: BundleType;
}

export default class Rollup {
  private inputOptions: IInputOptions;
  private outpuOptions: any[];
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  public async build(options: IBundleOptions, pkg: IPkg, cwd: string) {
    this.getOpts(options, pkg, cwd);
    this.outpuOptions.map(async item => {
      try {
        let inputOptions;
        if (item.format !== 'umd') {
          inputOptions = {
            ...this.inputOptions,
            // cjs and esm should external dependencies
            external: this.inputOptions.external.concat(Object.keys(pkg.dependencies || {})),
          };
        } else {
          // umd need bundle uglify and no uglify both
          const filename = basename(item.file, '.js');
          const developmentFile = join(cwd, item.file.replace(filename, `${filename}.development`));
          const developmentBundler = await rollup(this.inputOptions);
          await developmentBundler.write({ ...item, file: developmentFile });

          // options for uglify
          inputOptions = { ...this.inputOptions };
          inputOptions.plugins.push(uglify());
        }
        const bundler = await rollup(inputOptions);
        item.file = join(cwd, item.file);
        await bundler.write(item);
        // tslint:disable-next-line
        console.log(`build ${pkg.name} ${item.format} done`);
      } catch (error) {
        // tslint:disable-next-line
        console.error('bundle error', error);
      }
    });
  }

  private getOpts(options: IBundleOptions, pkg: IPkg, cwd: string) {
    const { debug, webpackConfig = { resolve: { alias: {} } } }: IApi = this.api;
    const {
      entry: input = 'src/index.js',
      cssModules = true,
      extraBabelPlugins = [],
      extraBabelPresets = [],
      namedExports,
      extraPostCSSPlugins = [],
      targets = {
        browsers: ['IE 11'],
      },
      cjs,
      esm,
      umd,
      external = [],
    } = options;
    const webpackAlias = this.transformAlias(webpackConfig.resolve.alias);
    this.inputOptions = {
      input: join(cwd, input),
      plugins: [
        peerExternal(),
        alias({
          ...webpackAlias,
          resolve: ['.js', '/index.js'],
        }),
        postcss({
          modules: cssModules,
          use: [
            [
              'less',
              {
                plugins: [new NpmImport({ prefix: '~' })],
                javascriptEnabled: true,
              },
            ],
          ],
          plugins: [autoprefixer, ...extraPostCSSPlugins],
        }),
        babel({
          runtimeHelpers: true,
          presets: [
            ...extraBabelPresets,
            [
              require.resolve('@babel/preset-env'),
              {
                modules: false,
                targets,
              },
            ],
            require.resolve('@babel/preset-react'),
          ],
          plugins: [
            ...extraBabelPlugins,
            ...umiBabel().plugins,
            [
              require.resolve('babel-plugin-inline-import-data-uri'),
              {
                extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'],
              },
            ],
          ],
          exclude: /node_modules/,
        }),
        json(),
        resolve({
          browser: true,
        }),
        commonjs({
          include: /node_modules/,
          namedExports: {
            // autoNamedExports not supported module.
            ...namedExports,
          },
        }),
        autoNamedExports(),
      ],
      onwarn: (warning: RollupWarning) => {
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return;
        }
        debug(warning);
      },
      external: external.concat(['react', 'react-dom', 'antd']),
    };

    // TODO 优化
    this.outpuOptions = [
      ...(cjs !== false && !(cjs && cjs.type === 'babel')
        ? [
            {
              format: 'cjs',
              file: pkg.main || (cjs && cjs.file) || 'dist/index.js',
            },
          ]
        : []),
      ...(esm !== false && !(esm && esm.type === 'babel')
        ? [
            {
              format: 'esm',
              file: pkg.module || (esm && esm.file) || 'dist/index.esm.js',
            },
          ]
        : []),
      ...(umd !== false
        ? [
            {
              format: 'umd',
              file: pkg.unpkg || (umd && umd.file) || 'dist/index.umd.js',
              globals: umd && umd.globals,
              name: (umd && umd.name) || camelCase(pkg.name),
            },
          ]
        : []),
    ];
  }

  // remove the tail $ symbol
  private transformAlias(webpackAlias: IStringObject): IStringObject {
    const result: IStringObject = {};
    Object.keys(webpackAlias)
      .reverse()
      .forEach(key => {
        const newKey = key.replace(/\$$/, '');
        result[newKey] = webpackAlias[key];
      });
    return result;
  }
}
