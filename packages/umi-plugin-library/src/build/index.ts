import rimraf from 'rimraf';
import Rollup from './rollup';
import Babel from './babel';
import { join } from 'path';
import { IApi, IBundleOptions, IArgs } from '..';

class Bundler {
  private bundlerRollup: Rollup;
  private bundlerBabel: Babel;
  private distFolder: string[];
  private api: IApi;

  constructor(api: IApi, opts: IBundleOptions) {
    this.api = api;
    this.bundlerRollup = new Rollup(api, opts);
    this.bundlerBabel = new Babel(api, opts);
    this.distFolder = ['dist', 'lib', 'es'];
  }

  public async build() {
    this.clean();
    this.bundlerRollup.build();
    this.bundlerBabel.build();
  }

  private clean() {
    this.distFolder.forEach(item => {
      rimraf.sync(join(this.api.cwd, item));
    });
  }
}

export default (api: IApi, opts: IBundleOptions, args: IArgs) => {
  const subCommand = args._[0];
  if (subCommand === 'build') {
    const bundler = new Bundler(api, opts);
    bundler.build();
  }
};
