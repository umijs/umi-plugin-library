# umi-plugin-library

> 基于 umi 的组件库开发工具, 为你提供组件库开发的全套解决方案, 让你专注于库的开发.

## 功能点
* 提供开箱即用的组件 (component) 和库 (library) 开发脚手架.
* 基于 docz + umi, 提供一个可以快速开始的组件开发环境.
* 支持 mdx 语法, 可以在 markdown 里写 jsx, 可以很方便的组织组件 demo 与 API 文档.
* 打包基于 rollup, 专注于组件与库的打包, 良好的 tree-shaking 特性可以让你的包更小, 不用插件也能支持按需加载.
* 支持 cjs, esm, umd 三种格式, 让你的包可以适用于各种应用场景.
* 支持 lerna 多包管理方式, 允许分包独立发布.
* umi, antd 亲和

## 适用场景
* 项目之间组件缺乏复用, 重复造轮子, 想要建立团队甚至业务线的组件库. 
* 建立团队通用的工具库, 或者提供给第三方的插件库. 
* 在系分阶段, 用来写 demo 验证方案. 
* 只用来写文档, 比如像这个文档.
* 想用来打包, 小, 尽量小.

## 快速开始
```bash
# 创建目录
$ mkdir my-lib && cd my-lib

# 初始化脚手架, 选择 library
$ yarn create umi

# 安装依赖
$ yarn install

# 运行
$ yarn run dev

# 打包
$ yarn run build
```

## 问题解决
* 钉钉搜索 23185890
* 钉钉 @蒲伟
* [Issues · umijs/umi-plugin-library · GitHub](https://github.com/umijs/umi-plugin-library/issues)
