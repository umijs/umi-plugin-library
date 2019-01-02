# umi-plugin-library

out of box compomnt develop plugin for umi. 
document based on docz, and bundle based on babel and rollup.

## install

`tnpm install umi-plguin-library`

## config

`.umirc.js`

```javascript
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
## options

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

## usage

### run a dev server
`umi doc dev`

### deploy doc site to `yourname.github.io/repo`
`umi doc deploy`

### bundle
`umi lib build`
