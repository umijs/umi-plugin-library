import { fork } from 'child_process';
import path, {join} from 'path';
import { IOpts } from '../..';

export default class {
  public doczPath: string;
  public rcPath: string;

  constructor(){
    this.doczPath = path.resolve(require.resolve('docz'), '../../bin/index.js');
    this.rcPath = join(__dirname, 'doczrc.js');
  }

  public dev({ theme, wrapper, typescript }: IOpts) {
    const child = fork(this.doczPath, [
      'dev',
      '--config',
      this.rcPath,
      '--port',
      '8001',
      ...(typescript ? ['--typescript'] : []),
      ...(theme ? ['--theme', theme] : []),
      ...(wrapper ? ['--theme', wrapper] : [])
    ]);

    child.on('exit', (code: number) => {
      process.exit(code);
    });
  }

  public build() {
    // const hello = 1;

  }
}
