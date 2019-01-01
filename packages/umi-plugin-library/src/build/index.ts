import Rollup from './rollup';
import Babel from './babel';
import { IApi, IBundleOptions, IArgs } from '..';

class Bundler {
  private bundlerRollup: Rollup;
  private bundlerBabel: Babel;

  constructor(api: IApi, opts: IBundleOptions) {
    this.bundlerRollup = new Rollup(api, opts);
    this.bundlerBabel = new Babel(api, opts);
  }

  public async build() {
    this.bundlerRollup.build();
    this.bundlerBabel.build();
  }
}

export default (api: IApi, opts: IBundleOptions, args: IArgs) => {
  const subCommand = args._[0];
  if (subCommand === 'build') {
    const bundler = new Bundler(api, opts);
    bundler.build();
  }
};
