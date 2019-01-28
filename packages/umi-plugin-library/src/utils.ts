import { join } from 'path';
import { existsSync } from 'fs';

export function useTypescript(cwd: string) {
  if (existsSync(join(cwd, 'tsconfig.json'))) {
    return true;
  }
  return false;
}
