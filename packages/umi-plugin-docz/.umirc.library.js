const { join } = require('path');

module.exports = {
  copy: {
    files: [join(__dirname, 'src/*.js')],
    dest: join(__dirname, 'dist'),
  },
  external: [ 'path', 'fs', 'child_process']
}
