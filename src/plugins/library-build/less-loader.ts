/**
 * less loader
 * use babel transform less to css
 */
import less from 'less';
import path, { join } from 'path';
// tslint:disable-next-line
const debug = require('debug')('umi-plugin-library');

module.exports = function processLess(data, filename) {
  let result: any;
  // less-plugin-npm-import 与 syncImport 冲突, 手工改为相对路径再解析
  if (data.includes(`@import '~`)) {
    const nodeModulesPath = path.relative(
      path.dirname(filename),
      join(process.cwd(), 'node_modules')
    );
    data = data.replace(`@import '~`, `@import '${nodeModulesPath}/`);
  }

  less.render(
    data,
    {
      filename,
      syncImport: true,
      javascriptEnabled: true,
    },
    (error, output) => {
      debug(error);
      result = output.css;
    }
  );

  return result.toString('utf8');
};
