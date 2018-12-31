import { loadWebpackConfig } from '../../utils';
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
      generateScopedName: '[local]___[hash:base64:5]',
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
    },
  },

  exclude: 'node_modules/**',
  ignore: ['**/*.test.js'],
  plugins: [
    ...babel.plugins,
    [
      'module-resolver',
      {
        alias: {
          // '@': './src'
        },
      },
    ],
  ],
};

export default config;
