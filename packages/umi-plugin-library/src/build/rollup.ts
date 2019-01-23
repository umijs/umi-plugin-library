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
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';
import camelCase from 'camelcase';
import { IApi, IBundleOptions, IStringObject, IPkg, IUmd } from '..';
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
          // options for uglify
          inputOptions = {
            ...this.inputOptions,
            plugins: [...this.inputOptions.plugins, ...(item.development ? [] : [terser()])],
          };
        }
        const bundler = await rollup(inputOptions);
        const info = `${item.format}: ${item.file}`;
        item.file = join(cwd, item.file);
        await bundler.write(item);
        this.api.log.success(`[${pkg.name}] ${info}`);
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
      extraBabelPlugins = [],
      extraBabelPresets = [],
      namedExports,
      targets = {
        ie: 11,
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
        this.pluinPostcss(options),
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
        ...(process.env.AUTO_NAMED_EXPORTS !== 'none' ? [autoNamedExports()] : []),
      ],
      onwarn: (warning: RollupWarning) => {
        if (warning.code === 'THIS_IS_UNDEFINED') {
          return;
        }
        debug(warning);
        if (warning.code === 'UNRESOLVED_IMPORT') {
          this.api.log.warn(warning.message);
        }
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
        ? [this.getUmdOptions(pkg, umd, true), this.getUmdOptions(pkg, umd, false)]
        : []),
    ];
  }

  private getUmdOptions(pkg: IPkg, umd: IUmd | undefined, development: boolean) {
    let file = pkg.unpkg || (umd && umd.file) || 'dist/index.umd.js';
    if (development) {
      const filename = basename(file, '.js');
      file = file.replace(filename, `${filename}.development`);
    }
    return {
      format: 'umd',
      file,
      globals: umd && umd.globals,
      name: (umd && umd.name) || camelCase(basename(pkg.name)),
      development,
    };
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

  private pluinPostcss(options: IBundleOptions) {
    const { extraPostCSSPlugins = [] } = options;
    let cssModules = options.cssModules;
    if (cssModules !== false) {
      cssModules = {
        ...(typeof cssModules === 'object' && cssModules),
        globalModulePaths: [/global\.less$/, /global\.css$/],
      };
    }

    return postcss({
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
    });
  }
}
