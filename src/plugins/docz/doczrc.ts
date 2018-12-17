import { css } from "docz-plugin-css";
import merge from 'webpack-merge';
import { loadWebpackConfig } from '../../utils/getWebpackConfig';

// 动态的获取运行时配置并启动, 这样 umi 与 docz 的环境能最大兼容
export default {
  modifyBabelRc: (babelrc: object) => {
    const { babel } = loadWebpackConfig('afWebpack');
    return merge(babelrc, babel)

  },
  modifyBundlerConfig: (config: object) => {
    const { resolve } = loadWebpackConfig('webpack');
    return merge({resolve}, config);
  },
  plugins: [
    css({
      cssmodules: true,
      loaderOpts: {
          javascriptEnabled: true,
      },
      preprocessor: "less",
    }),
    css({ preprocessor: 'postcss' }),
  ]
};
