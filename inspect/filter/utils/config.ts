import path from 'path'

/** inspect 项目根目录 */
const PROJECT_ROOT = path.resolve(__dirname, '../../')

const resolveFromRoot = (relativePath: string) =>
  path.resolve(PROJECT_ROOT, relativePath)

export const Files = {
  /** 执行的目标目录前缀 */
  TARGET: 'src/',
  /** 错误日志-TypeScript 错误 */
  ERR_TS: resolveFromRoot('dist/error-ts.log'),
  /** 错误日志-规范错误 */
  ERR_ESLINT: resolveFromRoot('dist/error-eslint.log'),
  /** 错误日志-最终格式 */
  ERR_LOG_JSON: resolveFromRoot('dist/error-log.json'),
}
