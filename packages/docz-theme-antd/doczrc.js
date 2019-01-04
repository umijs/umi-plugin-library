import { css } from "docz-plugin-css";

// 动态的获取运行时配置并启动, 这样 umi 与 docz 环境能最大兼容
export default {
  plugins: [
    css({
      cssmodules: true,
      loaderOpts: {
          javascriptEnabled: true,
      },
      preprocessor: "less",
    }),
    css({ preprocessor: 'postcss' }),
  ],
  theme: 'docz-theme-antd',
};
