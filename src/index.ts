import { getWebpackConfig } from './utils';

type Params = 'build' | 'dev';
export interface IArgs {
  _: {
    length: number;
    [index: number]: Params;
  };
}
export interface IApi {
  applyPlugins: (name: string, options: object) => object;
  cwd: string;
  registerCommand: (name: string, options: object, callback: (args: IArgs) => void) => void;
  webpackConfig: object;
}

export interface IOpts {
  theme: string;
  wrapper: string;
  typescript: string;
  plugins: any[];
}

function loadPlugins(plugins, api, opts, args) {
  try {
    plugins.forEach(item => {
      let name: string;
      if (Array.isArray(item)) {
        let options;
        [name, options] = item;
        opts = {
          ...opts,
          ...options,
        };
      } else {
        name = item;
      }
      require(name).default(api, opts, args);
    });
    // tslint:disable-next-line
  } catch (error) {
    // tslint:disable-next-line
    console.log(error);
  }
}

export default function(api: IApi, opts: any = {}) {
  api.registerCommand(
    'library',
    {
      description: 'start a library dev server',
      webpack: true,
    },
    args => {
      // 获取 config
      getWebpackConfig(api);
      // 加载插件
      const plugins = [
        ...(opts.plugins ? opts.plugins : []),
        './plugins/docz',
        ['./plugins/library-build', {}],
      ];
      loadPlugins(plugins, api, opts, args);
    }
  );
}
