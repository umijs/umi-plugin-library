const isAliEnv = require('is-ali-env');
const { spawn } = require('child_process')
const { join } = require('path')
const rimraf = require('rimraf');

// 可能 esm 包最近的更新有问题, 提了 issue, 先通过此方法 workaround
// https://github.com/standard-things/esm/issues/710
isAliEnv().then(_isAliEnv => {
  if (!_isAliEnv) {
    return;
  }

  // ref: https://stackoverflow.com/questions/37459717/error-spawn-enoent-on-windows
  let bin = 'tnpm';
  let params = ['install'];

  rimraf.sync(join(__dirname, 'node_modules/docz-plugin-css/node_modules/'));

  // windows
  if (/^win/.test(process.platform)) {
    bin = 'cmd';
    params = ['/s', '/c', 'tnpm'].concat(params);
  }

  child = spawn(bin, params, {
    cwd: join(__dirname, 'node_modules/docz-plugin-css')
  });
  child.on('error', (error) => {
    console.log(error);
  });
});
