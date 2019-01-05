import * as path from 'path';
import * as fs from 'fs';
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
    // no ts file treat as not ts project
    if(files.length > 0) {
      let indexDTs = path.join(this.baseFolder, 'index.d.ts');
      // if no index.d.ts, use index.js
      indexDTs = fs.existsSync(indexDTs) ? indexDTs : path.join(this.baseFolder, 'index.js');
      cmds.push(fse.copy(indexDTs, path.join(to, 'index.d.ts')));
    }
    return Promise.all(cmds);
  }
}
