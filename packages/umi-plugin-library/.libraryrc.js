const { join } = require('path');

module.exports = {
  copy: {
    files: [join(__dirname, 'src/build/babel/*.js')],
    dest: join(__dirname, 'dist')
  },
  external: [ 'fs', 'path', 'child_process' ]
}
