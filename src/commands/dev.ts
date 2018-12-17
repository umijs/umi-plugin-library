import { IOpts } from '../index';
import Docz from '../plugins/docz';

export default function(opts: IOpts) {
  const docz = new Docz();
  docz.dev(opts);
}
