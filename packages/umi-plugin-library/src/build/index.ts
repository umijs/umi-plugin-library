import rimraf from 'rimraf';
import Rollup from './rollup';
import Babel from './babel';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { IApi, IBundleOptions, IArgs } from '..';

class Bundler {
  private bundlerRollup: Rollup;
  private bundlerBabel: Babel;
  private distFolder: string[];
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
    this.bundlerRollup = new Rollup(api);
    this.bundlerBabel = new Babel(api);
    this.distFolder = ['dist', 'lib', 'es'];
  }

  public async build(opts: IBundleOptions) {
    const { cwd, pkg } = this.api;
    this.clean(cwd);
    this.bundlerRollup.build(opts, pkg, cwd);
    this.bundlerBabel.build(opts);
  }

  public async buildForLearna(opts: IBundleOptions) {
    readdirSync(join(this.api.cwd, 'packages')).forEach(folder => {
      const cwd = join(this.api.cwd, 'packages', folder);
      const pkg = readFileSync(join(cwd, 'package.json'), 'utf-8');
      if (pkg) {
        this.clean(cwd);
        this.bundlerRollup.build(opts, JSON.parse(pkg), cwd);
      }
    });

    this.bundlerBabel.build(opts);
  }

  private clean(cwd: string) {
    this.distFolder.forEach(item => {
      rimraf.sync(join(cwd, item));
    });
  }
}

export default (api: IApi, opts: IBundleOptions, args: IArgs) => {
  const subCommand = args._[0];
  const bundler = new Bundler(api);
  if (subCommand === 'build') {
    if (opts.learna) {
      bundler.buildForLearna(opts);
    } else {
      bundler.build(opts);
    }
  }
};
