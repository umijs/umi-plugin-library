import { rollup, watch, RollupOptions, OutputOptions, RollupWarning, Plugin } from 'rollup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import NpmImport from 'less-plugin-npm-import';
import umiBabel from 'babel-preset-umi';
import autoNamedExports from 'rollup-plugin-auto-named-exports';
import peerExternal from 'rollup-plugin-peer-deps-external';
import typescriptPlugin from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import autoprefixer from 'autoprefixer';
import camelCase from 'camelcase';
import copyPlugin from 'rollup-plugin-cpy';
import { IApi, IBundleOptions, IPkg, IUmd } from '..';
import { join, basename } from 'path';

const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs'];

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
        if (options.watch) {
          item.file = join(cwd, item.file);
          const watcher = watch([
            {
              ...inputOptions,
              output: item,
              watch: { exclude: ['node_modules/**'] },
            },
          ]);
          watcher.on('event', event => {
            if (event.code === 'FATAL' || event.code === 'ERROR') {
              this.api.log.error(event.error.message);
            } else if (event.code === 'END') {
              this.api.log.info('file changed');
            }
          });
        } else {
          const bundler = await rollup(inputOptions);
          const info = `${item.format}: ${item.file}`;
          item.file = join(cwd, item.file);
          await bundler.write(item);
          this.api.log.success(`[${pkg.name}] ${info}`);
        }
      } catch (error) {
        this.api.log.error(error.message);
        this.api.debug(error);
      }
    });
  }

  private getOpts(options: IBundleOptions, pkg: IPkg, cwd: string) {
    const { debug }: IApi = this.api;
    const {
      entry: input = 'src/index',
      cjs,
      esm,
      umd,
      external = [],
      typescript,
      copy,
      treeshake = { propertyReadSideEffects: false },
      sourcemap = false,
    } = options;
    this.inputOptions = {
      input: join(cwd, input),
      plugins: [
        peerExternal(),
        this.pluinPostcss(options),
        ...(typescript ? [this.pluginTypescript(options, cwd)] : []),
        this.pluginBabel(options),
        json(),
        ...this.pluginsResolve(options),
        ...(copy ? [copyPlugin(copy)] : []),
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
              file: (cjs && cjs.file) || pkg.main || 'dist/index.js',
              treeshake,
              sourcemap,
            },
          ]
        : []),
      ...(esm !== false && !(esm && esm.type === 'babel')
        ? [
            {
              format: 'esm',
              file: (esm && esm.file) || pkg.module || 'dist/index.esm.js',
              treeshake,
              sourcemap,
            },
          ]
        : []),
      ...(umd !== false
        ? [
            this.getUmdOptions(pkg, umd, treeshake, sourcemap, true),
            this.getUmdOptions(pkg, umd, treeshake, sourcemap, false),
          ]
        : []),
    ];
  }

  private getUmdOptions(
    pkg: IPkg,
    umd: IUmd | undefined,
    treeshake: object,
    sourcemap: boolean,
    development: boolean
  ) {
    let file = (umd && umd.file) || pkg.unpkg || 'dist/index.umd.js';
    if (development) {
      const filename = basename(file, '.js');
      file = file.replace(filename, `${filename}.development`);
    }
    return {
      format: 'umd',
      file,
      globals: umd && umd.globals,
      name: (umd && umd.name) || camelCase(basename(pkg.name)),
      treeshake,
      sourcemap,
      development,
    };
  }

  private pluinPostcss(options: IBundleOptions) {
    const { extraPostCSSPlugins = [] } = options;
    let cssModules = options.cssModules;
    if (cssModules !== false) {
      cssModules = {
        ...(typeof cssModules === 'object' && cssModules),
        globalModulePaths: [/global\.less$/, /global\.css$/, /node_modules/],
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

  private pluginTypescript(options: IBundleOptions, cwd: string) {
    const { typescript, sourcemap = false } = options;

    return typescriptPlugin({
      rollupCommonJSResolveHack: true,
      tsconfig: join(cwd, 'tsconfig.json'),
      tsconfigDefaults: {
        compilerOptions: {
          declaration: true,
          sourceMap: sourcemap,
        },
      },
      tsconfigOverride: {
        compilerOptions: {
          target: 'esnext',
        },
      },
      ...(typeof typescript === 'object' && typescript),
    });
  }

  private pluginBabel(options: IBundleOptions) {
    const { extraBabelPresets = [], extraBabelPlugins = [], targets = { ie: 11 } } = options;
    return babel({
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
      extensions: EXTENSIONS,
    });
  }

  private pluginsResolve(options: IBundleOptions) {
    const { namedExports, targets = {} } = options;
    return [
      resolve({
        jsnext: true,
        module: true,
        main: true,
        preferBuiltins: true,
        browser: !targets.hasOwnProperty('node'),
        extensions: EXTENSIONS,
      }),
      commonjs({
        include: /node_modules/,
        namedExports: {
          // autoNamedExports not supported module.
          ...namedExports,
        },
      }),
      ...(process.env.AUTO_NAMED_EXPORTS !== 'none' ? [autoNamedExports()] : []),
    ];
  }
}
