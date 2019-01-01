import * as path from 'path';
import fse from 'fs-extra';
import glob from 'glob';

export default class {
  private cwd: string;
  private baseFolder: string;

  constructor(baseFolder: string, cwd: string) {
    this.cwd = cwd;
    this.baseFolder = baseFolder;
  }

  public async run(folder: string) {
    const from = this.baseFolder;
    return await this.copyTypescript(from, path.join(this.cwd, folder));
  }

  private copyTypescript(from: string, to: string) {
    const files = glob.sync('**/*.d.ts', { cwd: from });
    const cmds = files.map((file: string) =>
      fse.copy(path.resolve(from, file), path.resolve(to, file))
    );
    cmds.push(fse.copy(path.join(this.baseFolder, 'index.js'), path.join(to, 'index.d.ts')));
    return Promise.all(cmds);
  }
}
