/**
 * config file not use ts
 * less loader
 * use babel transform less to css
 */
const less = require('less');
const path = require('path');

module.exports = function processLess(data, filename) {
  let result;
  // less-plugin-npm-import 与 syncImport 冲突, 手工改为相对路径再解析
  const nodeModulesPath = path.relative(
    path.dirname(filename),
    path.join(process.cwd(), 'node_modules')
  );
  if (data.includes(`@import '~`)) {
    data = data.replace(`@import '~`, `@import '${nodeModulesPath}/`);
  }
  if (data.includes(`@import "~`)) {
    data = data.replace(`@import "~`, `@import "${nodeModulesPath}/`);
  }

  less.render(
    data,
    {
      filename,
      syncImport: true,
      javascriptEnabled: true,
    },
    (error, output) => {
      result = output.css;
    }
  );

  return result.toString('utf8');
};
