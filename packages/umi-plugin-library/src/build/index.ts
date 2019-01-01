import Rollup from './rollup';
import { IApi, IBundleOptions, IArgs } from '..';

class Bundler {
  private bundler: Rollup;

  constructor(api: IApi, opts: IBundleOptions) {
    this.bundler = new Rollup(api, opts);
    // todo use babel
  }

  public async build() {
    this.bundler.build();
  }
}

export default (api: IApi, opts: IBundleOptions, args: IArgs) => {
  const subCommand = args._[0];
  if (subCommand === 'build') {
    const bundler = new Bundler(api, opts);
    bundler.build();
  }
};
