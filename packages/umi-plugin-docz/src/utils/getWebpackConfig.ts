import * as fs from 'fs';
import { join, resolve } from 'path';
import { IApi } from 'umi-plugin-types';

type filename = 'afWebpack' | 'webpack' | 'docOpts';
export interface IAfWebpackConfig {
  babel: {
    plugins: any[];
    presets: any[];
  };
}
export interface IWebpackConfig {
  resolve: {
    alias: {
      [prop: string]: string;
    };
  };
}
export interface IConfig {
  afWebpack: IAfWebpackConfig;
  webpack: IWebpackConfig;
}

export function writeFile(name: filename, data: any) {
  const configPath = resolve(__dirname, `${name}.json`);
  fs.writeFileSync(configPath, JSON.stringify(data));
}

export function readFile(name: filename) {
  const config = fs.readFileSync(join(__dirname, `${name}.json`), 'utf8');
  return JSON.parse(config);
}

/**
 * 从 runtime 拿出 config 写入文件中.
 * @param api
 */
export function getWebpackConfig(api: IApi): void {
  // 获取 webpack 运行时配置并写入
  writeFile('webpack', api.webpackConfig);

  // 获取 babel 运行时配置
  const afWebpackOpts = api.applyPlugins('modifyAFWebpackOpts', {
    initialValue: { cwd: api.cwd },
  });
  writeFile('afWebpack', afWebpackOpts);
}

/**
 * 返回配置内容
 * @param name
 */
export function loadWebpackConfig<T extends keyof IConfig>(name: T): IConfig[T] {
  return readFile(name);
}
