/**
 * config file, do not use ts
 */
import { css } from 'docz-plugin-css';
import merge from 'webpack-merge';
import { readFileSync } from 'fs';
import { join } from 'path';

function readFile(name) {
  const config = readFileSync(join(__dirname, `${name}.json`), 'utf8');
  return JSON.parse(config);
}

// 动态的获取运行时配置并启动, 这样 umi 与 docz 的环境能最大兼容
export default {
  modifyBabelRc: (babelrc) => {
    const { babel } = readFile('afWebpack');
    return merge(babelrc, babel);
  },
  modifyBundlerConfig: (config) => {
    const { resolve } = readFile('webpack');
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
    css({ preprocessor: 'postcss' }),
  ],
};
