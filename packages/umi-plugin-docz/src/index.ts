import { fork, ChildProcess } from 'child_process';
import { getWebpackConfig, writeFile } from './utils';
import { sync as resolveBin } from 'resolve-bin';
import ghpages from 'gh-pages';
import * as path from 'path';

export interface IOpts {
  [prop: string]: any;
}

type Params = 'build' | 'dev' | 'deploy';
export interface IArgs {
  _: {
    length: number;
    [index: number]: Params;
  };
}

export interface IPkg {
  name: string;
}

export type Log = (msg: string) => void;

export interface IApi {
  applyPlugins: (name: string, options: object) => object;
  cwd: string;
  pkg: IPkg;
  registerCommand: (name: string, options: object, callback: (args: IArgs) => void) => void;
  webpackConfig: object;
  debug: (msg: any) => void;
  log: {
    warn: Log;
    success: Log;
    error: Log;
    info: Log;
  };
}

class Docz {
  private doczPath: string;
  private rcPath: string;
  private distDir: string;
  private api: IApi;

  constructor(api: IApi) {
    this.doczPath = resolveBin('docz', { executable: 'docz' });
    this.rcPath = path.join(__dirname, 'doczrc.js');
    this.distDir = path.join(api.cwd, '.docz/dist');
    this.api = api;
  }

  public devOrBuild(action: Params) {
    const child = fork(this.doczPath, [action, '--config', this.rcPath, ...process.argv.slice(4)]);
    this.onEvent(child);
  }

  public deploy() {
    this.api.log.info('Publishing, it will take some time depending on your network');
    ghpages.publish(this.distDir, () => {
      // tslint:disable-next-line
      this.api.log.success('Publish done');
    });
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
      // write doc options to file for further use
      writeFile('docOpts', {
        ...opts,
        base: opts.base || `/${api.pkg.name}`,
        port: opts.port || '8001',
      });

      const subCommand = args._[0];
      const docz = new Docz(api);
      if (subCommand === 'dev' || subCommand === 'build') {
        docz.devOrBuild(subCommand);
      } else if (subCommand === 'deploy') {
        docz.deploy();
      }
    }
  );
}
