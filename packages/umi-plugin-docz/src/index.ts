import { fork, ChildProcess } from 'child_process';
import { getWebpackConfig } from './utils';
import { sync as resolveBin } from 'resolve-bin';
import ghpages from 'gh-pages';
import * as path from 'path';

export interface IOpts {
  theme?: string;
  wrapper?: string;
  typescript?: string;
  indexHtml?: string;
}

type Params = 'build' | 'dev' | 'deploy';
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
  private doczPath: string;
  private rcPath: string;
  private distDir: string;

  constructor(api: IApi) {
    this.doczPath = resolveBin('docz', { executable: 'docz' });
    this.rcPath = path.join(__dirname, 'doczrc.js');
    this.distDir = path.join(api.cwd, '.docz/dist');
  }

  public dev(opts: IOpts) {
    const comnonOpts = this.getCommonOptions(opts);
    const child = fork(this.doczPath, [
      'dev',
      '--config',
      this.rcPath,
      '--port',
      '8001',
      ...comnonOpts,
      ...process.argv.slice(4),
    ]);

    this.onEvent(child);
  }

  public build(opts: IOpts) {
    const comnonOpts = this.getCommonOptions(opts);
    const child = fork(this.doczPath, [
      'build',
      '--config',
      this.rcPath,
      '--base',
      '.',
      ...comnonOpts,
      ...process.argv.slice(4),
    ]);
    this.onEvent(child);
  }

  public deploy() {
    ghpages.publish(this.distDir, () => {
      // tslint:disable-next-line
      console.log('publish done');
    });
  }

  private getCommonOptions(opts: IOpts = {}) {
    const { theme, wrapper, typescript, indexHtml } = opts;
    return [
      ...(typescript ? ['--typescript', typescript] : []),
      ...(theme ? ['--theme', theme] : []),
      ...(wrapper ? ['--wrapper', wrapper] : []),
      ...(indexHtml ? ['--indexHtml', indexHtml] : []),
    ];
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
      const docz = new Docz(api);
      if (subCommand === 'dev') {
        docz.dev(opts);
      } else if (subCommand === 'build') {
        docz.build(opts);
      } else if (subCommand === 'deploy') {
        docz.deploy();
      }
    }
  );
}
