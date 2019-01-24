import doczPlugin, { IOpts as IDocOpts } from 'umi-plugin-docz';
import Build from './build';

export type Params = 'build' | 'dev' | 'deploy';

export type BabelOpt = string | [string, any?];

export type BundleTool = 'rollup' | 'babel';

export type Log = (msg: string) => void;
export interface IArgs {
  _: {
    length: number;
    [index: number]: Params;
  };
}

export interface IPkg {
  name: string;
  main?: string;
  module?: string;
  unpkg?: string;
  dependencies: IStringObject;
}

export interface IApi {
  applyPlugins: (name: string, options: object) => object;
  cwd: string;
  registerCommand: (name: string, options: object, callback: (args: IArgs) => void) => void;
  webpackConfig: {
    resolve: {
      alias: IStringObject;
    };
  };
  debug: (msg: any) => void;
  pkg: IPkg;
  log: {
    warn: Log;
    success: Log;
    error: Log;
    info: Log;
  };
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
}

export interface IStringObject {
  [prop: string]: string;
}

export default function(api: IApi, opts: IOpts = {}) {
  // register docz plugin
  doczPlugin(api, {
    ...opts.doc,
    camelCase: typeof opts.cssModules === 'object' && opts.cssModules.camelCase,
  });
  api.registerCommand(
    'lib',
    {
      description: 'start a library dev server',
      webpack: true,
    },
    args => {
      // build
      Build(api, opts, args);
    }
  );
}
