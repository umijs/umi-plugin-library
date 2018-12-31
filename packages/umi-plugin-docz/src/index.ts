import { fork, ChildProcess } from 'child_process';
import { getWebpackConfig } from './utils';
import { sync as resolveBin } from 'resolve-bin';
import * as path from 'path';

export interface IOpts {
  theme?: string;
  wrapper?: string;
  typescript?: string;
  indexHtml?: string;
}

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
  debug: (msg: any) => void;
}

class Docz {
  public doczPath: string;
  public rcPath: string;

  constructor() {
    this.doczPath = resolveBin('docz', { executable: 'docz' });
    this.rcPath = path.join(__dirname, 'doczrc.js');
  }

  public dev(opts: IOpts = {}) {
    const { theme, wrapper, typescript, indexHtml } = opts;
    const child = fork(this.doczPath, [
      'dev',
      '--config',
      this.rcPath,
      '--port',
      '8001',
      ...(typescript ? ['--typescript', typescript] : []),
      ...(theme ? ['--theme', theme] : []),
      ...(wrapper ? ['--wrapper', wrapper] : []),
      ...(indexHtml ? ['--indexHtml', indexHtml] : []),
    ]);

    this.onEvent(child);
  }

  public build() {
    const child = fork(this.doczPath, ['build', '--config', this.rcPath, 'base', '.']);
    this.onEvent(child);
  }

  private onEvent(child: ChildProcess) {
    child.on('exit', (code: number) => {
      process.exit(code);
    });
  }
}

export default function(api: IApi, opts: IOpts = {}) {
  api.registerCommand(
    'doc',
    {
      description: 'start a doc server',
      webpack: true,
    },
    (args: IArgs) => {
      getWebpackConfig(api);
      const subCommand = args._[0];
      if (subCommand === 'dev') {
        const docz = new Docz();
        docz.dev(opts);
      } else if (subCommand === 'build') {
        const docz = new Docz();
        docz.build();
      }
    }
  );
}
