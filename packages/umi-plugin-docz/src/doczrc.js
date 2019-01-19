/**
 * docz config file, do not use ts
 */
import { css } from 'docz-plugin-css-temp';
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
    // 名为 global 的不使用 css modules
    css({
      preprocessor: 'less',
      cssmodules: false,
      ruleOpts: {
        test: /global\.less$/
      },
      loaderOpts: {
        javascriptEnabled: true,
      },
    }),
    css({
      preprocessor: 'less',
      cssmodules: true,
      ruleOpts: {
        exclude: /global\.less$/
      },
      loaderOpts: {
        javascriptEnabled: true,
      },
    }),
    css({
      preprocessor: 'postcss',
      cssmodules: false,
      ruleOpts: {
        test: /global\.css$/
      },
    }),
    css({
      preprocessor: 'postcss',
      cssmodules: true,
      ruleOpts: {
        exclude: /global\.css$/
      }
  }),
  ],
};
