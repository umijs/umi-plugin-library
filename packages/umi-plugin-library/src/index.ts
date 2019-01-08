import doczPlugin, { IOpts as IDocOpts } from 'umi-plugin-docz';
import Build from './build';

type Params = 'build' | 'dev' | 'deploy';
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
}

export interface IOpts extends IBundleOptions {
  doc?: IDocOpts;
}

export type BabelOpt = string | [string, any?];

export type BundleTool = 'rollup' | 'babel';

export interface IBundleTypeOutput {
  type: BundleTool;
  file?: string;
  dir?: string;
}

export interface IBundleOptions {
  entry?: string;
  cssModules?: boolean;
  extraBabelPlugins?: BabelOpt[];
  extraBabelPresets?: BabelOpt[];
  extraPostCSSPlugins?: any[];
  namedExports?: IStringObject;
  esm?: IBundleTypeOutput | false;
  cjs?: IBundleTypeOutput | false;
  targets?:
    | string
    | string[]
    | {
        [prop: string]: string;
      };
  umd?:
    | {
        globals?: IStringObject;
        name?: string;
        file?: string;
      }
    | false;
  external?: string[];
}

export interface IStringObject {
  [prop: string]: string;
}

export default function(api: IApi, opts: IOpts = {}) {
  // register docz plugin
  doczPlugin(api, opts.doc);
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
