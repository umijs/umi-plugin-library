import Dev from './commands/dev';

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
}

export default function(api: IApi, opts: IOpts) {
  api.registerCommand('library', {
      description: 'start a library dev server',
      webpack: true,
  },
  (args => {
    const subCommand = args._[0];
    if(subCommand === 'dev') {
      Dev(api, opts);
    }
  }));
}
