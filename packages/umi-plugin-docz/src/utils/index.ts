export { getWebpackConfig, loadWebpackConfig, writeFile, readFile } from './getWebpackConfig';

/**
 * JSON.stringify 不能序列化 function, 所以需要变通的先 toString, 再 eval
 * @param func
 */
export function stringifyFunction<T>(func: (params: T) => T) {
  return func && `(${func.toString()})`;
}
