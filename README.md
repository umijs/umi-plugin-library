# umi-plugin-library

Library development plugin for umi. The documentation is based on [docz](https://github.com/pedronauck/docz), and bundle is based on babel & [rollup](http://rollupjs.org/).

## Install

```bash
$ yarn add umi-plugin-library
```

## Config

Config in `.umirc.js`.

```js
export default {
  plugins: [
    ['umi-plugin-library', {
      // docz 配置
      doc: {
        theme: 'docz-theme-antd'
      },
      input: 'components/index.js',
      esm: {
        type: 'babel',
      },
      cjs: {
        type: 'rollup',
      },
      namedExports: {
        [require.resolve('react-is')]: ['ForwardRef', 'isElement', 'isValidElementType']
      }
    }]
  ]
}
```

## Options

```typescript
export interface IBundleOptions {
  input?: string;
  cssModules?: boolean;
  extraBabelPlugins?: BabelOpt[];
  extraBabelPresets?: BabelOpt[];
  extraPostCSSPlugins?: any[];
  namedExports?: {
    [props: string]: string;
  };
  esm?: IBundleTypeOutput | false;
  cjs?: IBundleTypeOutput | false;
  umd?:
    | {
        globals?: {
          [props: string]: string;
        };
        name?: string;
      }
    | false;
  external?: string[];
}
```

## Usage

### run a dev server

`umi doc dev`

### deploy doc site to `yourname.github.io/repo`

`umi doc deploy`

### bundle

`umi lib build`
