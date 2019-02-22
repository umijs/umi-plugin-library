import doczPlugin, { IOpts as IDocOpts } from 'umi-plugin-docz';
import { IApi } from 'umi-plugin-types';
import Build from './build';
import { useTypescript } from './utils';

export type Params = 'build' | 'dev' | 'deploy';

export type BabelOpt = string | [string, any?];

export type BundleTool = 'rollup' | 'babel';

export interface IArgs {
  _: {
    length: number;
    [index: number]: Params;
  };
  w?: boolean;
  watch?: boolean;
}

export interface IPkg {
  name: string;
  main?: string;
  module?: string;
  unpkg?: string;
  dependencies: IStringObject;
}

export interface IOpts extends IBundleOptions {
  doc?: IDocOpts;
}

export interface IBundleTypeOutput {
  type: BundleTool;
  file?: string;
  dir?: string;
}

export interface IUmd {
  globals?: IStringObject;
  name?: string;
  file?: string;
}

export interface ICssModules {
  camelCase?: boolean;
  globalModulePaths?: RegExp[];
}

export interface IBundleOptions {
  watch?: boolean;
  entry?: string;
  cssModules?: boolean | ICssModules;
  extraBabelPlugins?: BabelOpt[];
  extraBabelPresets?: BabelOpt[];
  extraPostCSSPlugins?: any[];
  namedExports?: IStringObject;
  esm?: IBundleTypeOutput | false;
  cjs?: IBundleTypeOutput | false;
  umd?: IUmd | false;
  targets?:
    | string
    | string[]
    | {
        [prop: string]: string;
      };
  external?: string[];
  typescript?: boolean | object;
  copy?: {
    files: string[];
    dest: string;
  };
  treeshake?: {
    /** If false, assume reading a property of an object never has side-effects. */
    propertyReadSideEffects: boolean;
    pureExternalModules: boolean;
  };
  sourcemap?: boolean;
}

export interface IStringObject {
  [prop: string]: string;
}

export default function(api: IApi, opts: IOpts = {}) {
  // use typescript?
  opts.typescript = opts.typescript !== undefined ? opts.typescript : useTypescript(api.cwd);
  // register docz plugin
  doczPlugin(api as any, {
    ...opts.doc,
    cssModules: opts.cssModules,
    typescript: opts.typescript,
  });
  api.registerCommand(
    'lib',
    {
      description: 'start a library dev server',
      webpack: true,
    },
    args => {
      // build
      return Build(api, opts, args);
    }
  );
}
