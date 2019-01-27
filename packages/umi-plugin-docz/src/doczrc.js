/**
 * docz config file, not use ts
 */
import { css } from 'docz-plugin-css-temp';
import merge from 'webpack-merge';
import { readFileSync } from 'fs';
import { join } from 'path';
import deepmerge from 'deepmerge';
import defaultThemeConfig from './defaultThemeConfig';

function readFile(name) {
  const config = readFileSync(join(__dirname, `${name}.json`), 'utf8');
  return JSON.parse(config);
}

const customOpions = readFile('docOpts');
const { themeConfig: customThemeConfig = {}, style = [], script = [], favicon, cssModules, ...rest } = customOpions;

// external js and css
const htmlContext = {
  favicon,
  head: {
    links: style.map(item => ({
      rel: 'stylesheet',
      href: item
    })),
    scripts: script.map(item => ({
      src: item
    }))
  }
}

const cssOpts = {
  camelCase: typeof cssModules === 'object' && cssModules.camelCase
};

// use umi runtime webpack config
export default {
  ...rest,
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
        test: [/global\.less$/, /node_modules/]
      },
      loaderOpts: {
        javascriptEnabled: true,
      },
    }),
    css({
      preprocessor: 'less',
      cssmodules: !!cssModules,
      ruleOpts: {
        exclude: [/global\.less$/, /node_modules/]
      },
      loaderOpts: {
        javascriptEnabled: true,
      },
      cssOpts
    }),
    css({
      preprocessor: 'postcss',
      cssmodules: false,
      ruleOpts: {
        test: [/global\.css$/, /node_modules/]
      },
    }),
    css({
      preprocessor: 'postcss',
      cssmodules: !!cssModules,
      ruleOpts: {
        exclude: [/global\.css$/, /node_modules/]
      },
      cssOpts
  }),
  ],
  themeConfig: deepmerge(defaultThemeConfig, customThemeConfig),
  htmlContext
};
