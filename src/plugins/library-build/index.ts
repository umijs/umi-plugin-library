import { sync as resolveBin } from 'resolve-bin';
import { fork } from 'child_process';
import { join } from 'path';
import fs from 'fs';
import Copyfile from './copyfile';

export default class {
  public babel: string;
  public babelRc: string;
  public hasIndex: boolean;

  constructor() {
    this.babel = resolveBin('@babel/cli', { executable: 'babel' });
    this.babelRc = join(__dirname, 'babel.config');
    this.hasIndex = fs.existsSync(join(process.cwd(), 'src/components/index.js'));
  }

  public async build() {
    this.beforeBuild();
    await Promise.all([this.buildEs5(), this.buildEs6()]);
    await new Copyfile().run();
    this.aferBuild();
  }

  private beforeBuild() {
    const rimraf = resolveBin('rimraf');
    fork(rimraf, ['./lib']);
    fork(rimraf, ['./es']);
    if (!this.hasIndex) {
      const createIndex = resolveBin('create-index');
      fork(createIndex, ['./src/components']);
    }
  }

  private buildEs5() {
    return new Promise(resolve => {
      const child = fork(
        this.babel,
        ['--config-file', this.babelRc, './src/components', '--out-dir', './lib'],
        {
          env: {
            BABEL_ENV: 'es5',
          },
        }
      );
      child.on('exit', () => {
        resolve();
      });
    });
  }

  private buildEs6() {
    return new Promise(resolve => {
      const child = fork(
        this.babel,
        ['--config-file', this.babelRc, './src/components', '--out-dir', './es'],
        {
          env: {
            BABEL_ENV: 'es6',
          },
        }
      );
      child.on('exit', () => {
        resolve();
      });
    });
  }

  // tslint:disable-next-line
  private buildUmd() {}

  private aferBuild() {
    // 如果原本没有 index, 需要删除.
    if (!this.hasIndex) {
      fs.unlinkSync('./src/components/index.js');
    }
    // tslint:disable-next-line
    console.log('build umi library done!');
  }

  private onEvent(child) {
    child.on('exit', (code: number) => {
      process.exit(code);
    });
  }
}
