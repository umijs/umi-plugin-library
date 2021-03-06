import { sync as resolveBin } from 'resolve-bin';
import { fork } from 'child_process';
import { join, dirname } from 'path';
import { IApi } from 'umi-plugin-types';
import Copyfile from './copyfile';
import { IBundleOptions } from '../..';
type buildType = 'cjs' | 'esm';

export default class Babel {
  private api: IApi;
  private cwd: string;
  private babel: string;
  private babelRc: string;
  private input: string;

  constructor(api: IApi) {
    this.api = api;
    this.cwd = api.cwd;
    this.babel = resolveBin('@babel/cli', { executable: 'babel' });
    this.babelRc = join(__dirname, 'babel.config');
  }

  public async build(options: IBundleOptions) {
    const { cjs, esm, entry: input = 'src/index.js' } = options;
    this.input = dirname(join(this.cwd, input));
    const copy = new Copyfile(this.input, this.cwd);
    if (cjs && cjs.type === 'babel') {
      const dir = 'lib';
      await this.complie(dir, options, 'cjs');
      await copy.run(dir);
      this.api.log.success('complie cjs done');
    }
    if (esm && esm.type === 'babel') {
      const dir = 'es';
      await this.complie(dir, options, 'esm');
      await copy.run(dir);
      this.api.log.success('complie esm done');
    }
  }

  private async complie(dir: string, options: IBundleOptions, type: buildType): Promise<boolean> {
    const { watch = false, sourcemap = false } = options;
    return new Promise(resolve => {
      const child = fork(
        this.babel,
        [
          '--config-file',
          this.babelRc,
          this.input,
          '--out-dir',
          dir,
          ...(watch ? ['--watch'] : []),
          ...(sourcemap ? ['--source-maps'] : []),
        ],
        {
          env: {
            BABEL_ENV: type,
          },
        }
      );
      child.on('exit', () => {
        resolve(true);
      });
    });
  }
}
