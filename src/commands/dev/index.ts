import { IApi, IOpts } from '../..';
import { getWebpackConfig } from '../../utils/getWebpackConfig';
import Docz from '../../plugins/docz';


export default function(api: IApi, opts: IOpts) {
  getWebpackConfig(api);
  const docz = new Docz();
  docz.dev(opts);
}
