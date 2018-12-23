import { sync as resolveBin } from 'resolve-bin';
import { fork } from 'child_process';
import { join } from 'path';
import fs from 'fs';
import Copyfile from './copyfile';
import build from 'af-webpack/build';
import camelcase from 'camelcase';

class LibraryBuild {
  private babel: string;
  private babelRc: string;
  private hasIndex: boolean;
  private baseFolder: string;
  private api: any;
  private cwd: string;

  constructor(api) {
    this.api = api;
    this.cwd = api.paths.cwd || process.cwd();
    this.babel = resolveBin('@babel/cli', { executable: 'babel' });
    this.babelRc = join(__dirname, 'babel.config');
    this.baseFolder = this.getBaseFolder();
    this.hasIndex = fs.existsSync(join(this.baseFolder, 'index.js'));
  }

  public async build() {
    try {
      this.beforeBuild();
      this.buildUmd();
      await Promise.all([this.buildEs5(), this.buildEs6()]);
      await new Copyfile(this.baseFolder, this.cwd).run();
      this.aferBuild();
    } catch (error) {
      this.api.debug(error);
    }
  }

  private getBaseFolder() {
    let baseFolder = join(this.cwd, 'src/component');
    if (!fs.existsSync(baseFolder)) {
      baseFolder = join(this.cwd, 'src/components');
    }
    if (!fs.existsSync(baseFolder)) {
      baseFolder = join(this.cwd, 'components');
    }
    if (!fs.existsSync(baseFolder)) {
      throw new Error('components folder not found!');
    }
    return baseFolder;
  }

  private beforeBuild() {
    const rimraf = resolveBin('rimraf');
    fork(rimraf, ['./umd']);
    fork(rimraf, ['./lib']);
    fork(rimraf, ['./es']);
    if (!this.hasIndex) {
      const createIndex = resolveBin('create-index');
      fork(createIndex, [this.baseFolder]);
    }
  }

  private buildEs5() {
    return new Promise(resolve => {
      const child = fork(
        this.babel,
        ['--config-file', this.babelRc, this.baseFolder, '--out-dir', './lib'],
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
        ['--config-file', this.babelRc, this.baseFolder, '--out-dir', './es'],
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

  private buildUmd() {
    const { debug, webpackConfig: config } = this.api;
    const webpackConfig = {
      ...config,
      externals: {
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
        ...config.externals,
      },
      entry: join(this.baseFolder, 'index'),
      output: {
        path: join(this.cwd, './umd'),
        filename: '[name].js',
        library: camelcase(this.api.pkg.name),
        libraryTarget: 'umd',
        umdNamedDefine: true,
      },
    };
    build({
      cwd: this.cwd,
      webpackConfig,
      onSuccess() {
        // debug(stats);
      },
      onFail({ err }) {
        debug(err);
      },
    });
  }

  private aferBuild() {
    // 如果原本没有 index, 需要删除.
    if (!this.hasIndex) {
      fs.unlinkSync(join(this.baseFolder, 'index.js'));
    }
    // tslint:disable-next-line
    console.log('build umi library done!');
  }
}

export default (api, _, args) => {
  const subCommand = args._[0];
  if (subCommand === 'build') {
    const bundler = new LibraryBuild(api);
    bundler.build();
  }
};
