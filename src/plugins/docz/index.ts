import { fork } from 'child_process';
import path, { join } from 'path';

class Docz {
  public doczPath: string;
  public rcPath: string;

  constructor() {
    this.doczPath = path.resolve(require.resolve('docz'), '../../bin/index.js');
    this.rcPath = join(__dirname, 'doczrc.js');
  }

  public dev(opts: any = {}) {
    const { theme, wrapper, typescript, indexHtml } = opts;
    const child = fork(this.doczPath, [
      'dev',
      '--config',
      this.rcPath,
      '--port',
      '8001',
      ...(typescript ? ['--typescript'] : []),
      ...(theme ? ['--theme', theme] : []),
      '--wrapper',
      ...(wrapper ? [wrapper] : []), // workaround: https://github.com/pedronauck/docz/issues/551
      '--indexHtml',
      ...(indexHtml ? [indexHtml] : []),
    ]);

    this.onEvent(child);
  }

  public build() {
    const child = fork(this.doczPath, ['build', '--config', this.rcPath, 'base', '.']);

    this.onEvent(child);
  }

  private onEvent(child) {
    child.on('exit', (code: number) => {
      process.exit(code);
    });
  }
}

export default (_, opts, args) => {
  const subCommand = args._[0];
  if (subCommand === 'dev') {
    const docz = new Docz();
    docz.dev(opts);
  }
};
