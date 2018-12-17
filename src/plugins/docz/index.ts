import { fork } from 'child_process';
import path, { join } from 'path';

export default class {
  public doczPath: string;
  public rcPath: string;

  constructor() {
    this.doczPath = path.resolve(require.resolve('docz'), '../../bin/index.js');
    this.rcPath = join(__dirname, 'doczrc.js');
  }

  public dev(opts: any = {}) {
    const { theme, wrapper, typescript } = opts;
    const child = fork(this.doczPath, [
      'dev',
      '--config',
      this.rcPath,
      '--port',
      '8001',
      ...(typescript ? ['--typescript'] : []),
      ...(theme ? ['--theme', theme] : []),
      ...(wrapper ? ['--wrapper', wrapper] : []),
    ]);

    child.on('exit', (code: number) => {
      process.exit(code);
    });
  }

  public build() {
    // const hello = 1;
  }
}
