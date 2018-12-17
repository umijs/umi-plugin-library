import path from 'path';
import fse from 'fs-extra';
import glob from 'glob';

export default class {
  private cwd: string;
  private baseFolder: string;

  constructor(baseFolder) {
    this.cwd = process.cwd();
    this.baseFolder = baseFolder;
  }

  public async run() {
    const from = this.baseFolder;
    return await Promise.all([
      this.copyTypescript(from, path.join(this.cwd, './lib')),
      this.copyTypescript(from, path.join(this.cwd, './es')),
    ]);
  }

  private copyTypescript(from: string, to: string) {
    const files = glob.sync('**/*.d.ts', { cwd: from });
    const cmds = files.map(file => fse.copy(path.resolve(from, file), path.resolve(to, file)));
    cmds.push(fse.copy(path.join(this.baseFolder, 'index.js'), path.join(to, 'index.d.ts')));
    return Promise.all(cmds);
  }
}
