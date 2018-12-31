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
      if (typeof item === 'string') {
        item = [item];
      }
      const [name, options] = item;
      opts = {
        ...opts,
        ...options,
      };
      require(name).default(api, opts, args);
    });
  } catch (error) {
    api.debug(error);
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
