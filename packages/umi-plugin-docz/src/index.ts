import { fork, ChildProcess } from 'child_process';
import { getWebpackConfig, writeFile } from './utils';
import { sync as resolveBin } from 'resolve-bin';
import ghpages from 'gh-pages';
import { IApi } from 'umi-plugin-types';
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
    // 通过 slice 取命令的运行参数传给 docz. process.argv = ['node', 'umi', 'doc', 'dev', '--config', 'path/to/config']
    let params = [action, ...process.argv.slice(4)];

    // 允许使用自己的 docz 配置文件, 需要自己解决各种问题
    if (params.indexOf('--config') === -1) {
      params = params.concat(['--config', this.rcPath]);
    }

    const child = fork(this.doczPath, params);
    this.onEvent(child);
    return child;
  }

  public deploy() {
    this.api.log.info('Publishing, it will take some time depending on your network');
    ghpages.publish(this.distDir, () => {
      // tslint:disable-next-line
      this.api.log.success('Publish done');
    });
  }

  private onEvent(child: ChildProcess) {
    child.on('message', (message: any) => {
      // 将消息传递给父进程
      if (process.send) {
        process.send(message);
      }
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
      // Support extend doc's sub command in other plugins
      const subCommandHandler = api.applyPlugins('modifyDocSubCommandHandler', {
        initialValue: {},
      });
      const handler = subCommandHandler[subCommand];
      if (handler) {
        return handler({
          args,
        });
      }

      const docz = new Docz(api);
      if (subCommand === 'dev' || subCommand === 'build') {
        // 返回 Promise，这样 command 直接能够串起来
        return new Promise((resolve, reject) => {
          const child = docz.devOrBuild(subCommand);
          child.on('exit', (code: number) => {
            if (code === 1) {
              reject(new Error('Doc build failed'));
            } else {
              resolve();
            }
          });
        });
      } else if (subCommand === 'deploy') {
        docz.deploy();
      }
    }
  );
}
