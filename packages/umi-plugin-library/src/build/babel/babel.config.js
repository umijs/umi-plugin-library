// config file not ues ts
const { join } = require('path');
const babelMerge = require('babel-merge');
const umiBabelConfig = require('babel-preset-umi').default();

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
    cjs: {
      ...babelMerge(umiBabelConfig, {
        plugins: [getCssPlugin('./lib/index.css')],
      }),
    },
    esm: {
      // esm 继承 umi 其他插件, override @babel/preset-env 插件.
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
    ...umiBabelConfig.plugins,
    [
      require.resolve("babel-plugin-inline-import-data-uri"), {
        "extensions": ["png", "jpg", "jpeg", "gif", "svg"]
      }
    ]
  ],
};

module.exports = config;
