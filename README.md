# umi-plugin-library

基于 umi 的组件库开发工具。

## 功能点

* ✔︎ 提供开箱即用的组件 (component) 和库 (library) 开发脚手架
* ✔︎ 基于 docz + umi, 提供一个可以快速开始的组件开发环境
* ✔︎ 支持 mdx 语法, 可以在 markdown 里写 jsx, 可以很方便的组织组件 demo 与 API 文档
* ✔︎ 打包基于 rollup, 专注于组件与库的打包, 良好的 tree-shaking 特性可以让你的包更小, 不用插件也能支持按需加载
* ✔︎ 支持 cjs, esm, umd 三种格式, 让你的包可以适用于各种应用场景
* ✔︎ cjs 和 esm 格式支持 rollup 和 babel 两种打包方式
* ✔︎ 支持 lerna 多包管理方式, 允许分包独立发布
* ✔︎ 支持 TypeScript

## 适用场景

* 项目之间组件缺乏复用, 重复造轮子, 想要建立团队甚至业务线的组件库
* 建立团队通用的工具库, 或者提供给第三方的插件库
* 在系分阶段, 用来写 demo 验证方案
* 只用来写文档, 比如像这个文档
* 想用来打包, 小, 尽量小

## 快速开始

```bash
# 创建目录
$ mkdir lib && cd lib

# 初始化脚手架, 选择 library
$ yarn create umi

# 安装依赖
$ yarn install

# 基于文档进行调试
$ yarn run dev

# 打包
$ yarn run build
```

## [文档](https://umijs.github.io/umi-plugin-library/)

## 问题解决

### 钉钉群

<img src="https://gw.alipayobjects.com/zos/rmsportal/jPXcQOlGLnylGMfrKdBz.jpg" width="60" />

### Issue 提问

[Issues · umijs/umi-plugin-library · GitHub]()

紧急问题可在钉钉联系 @蒲伟 解决。

## License

[MIT](https://github.com/umijs/umi-plugin-library/blob/master/LICENSE)
