import { loadWebpackConfig } from '../../utils/getWebpackConfig';
import { join } from 'path';
import babelMerge from 'babel-merge';
import babelUmi from 'babel-preset-umi';

const umiBabelConfig = babelUmi();

const { babel } = loadWebpackConfig('afWebpack');

/**
 * 获取 css 插件
 */
const getCssPlugin = path => {
  return [
    'css-modules-transform',
    {
      preprocessCss: join(__dirname, 'less-loader'),
      extensions: ['.css', '.less'],
      extractCss: path,
    },
  ];
};

const config = {
  env: {
    es5: {
      ...babelMerge(umiBabelConfig, {
        plugins: [getCssPlugin('./lib/index.css')],
      }),
      ignore: ['**/*.test.js'],
    },
    es6: {
      // es6 继承 umi 其他插件, override @babel/preset-env 插件.
      ...babelMerge(umiBabelConfig, {
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              targets: {
                esmodules: true,
              },
              modules: false,
            },
          ],
        ],
        plugins: [getCssPlugin('./es/index.css')],
      }),
      ignore: ['**/*.test.js'],
    },
  },
  exclude: 'node_modules/**',
  ignore: ['**/*.test.js'],
  plugins: babel.plugins,
};

export default config;
