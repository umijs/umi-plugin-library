/**
 * docz config file, do not use ts
 */
import { css } from 'docz-plugin-css';
import merge from 'webpack-merge';
import { readFileSync } from 'fs';
import { join } from 'path';

function readFile(name) {
  const config = readFileSync(join(__dirname, `${name}.json`), 'utf8');
  return JSON.parse(config);
}

// use umi runtime webpack config
export default {
  modifyBabelRc: (babelrc) => {
    const { babel } = readFile('afWebpack');
    return merge(babelrc, babel);
  },
  modifyBundlerConfig: (config) => {
    const { resolve } = readFile('webpack');

    // 依赖可能会被 hoist 到这里
    config.resolve.modules.push(join(__dirname, '../node_modules'));
    config.resolveLoader.modules.push(join(__dirname, '../node_modules'));

    return merge({ resolve }, config);
  },
  plugins: [
    css({
      cssmodules: true,
      loaderOpts: {
        javascriptEnabled: true,
      },
      preprocessor: 'less',
    }),
    css({
      preprocessor: 'postcss',
      cssmodules: true,
  }),
  ],
};
