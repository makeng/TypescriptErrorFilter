import path from 'path'

// 定义“项目根目录”。就是“往上跳几级可以找到 /dist”
const PROJECT_ROOT = path.resolve(__dirname, '../../')

// 2. 创建一个更明确的 helper
const resolveFromRoot = (relativePath: string) =>
  path.resolve(PROJECT_ROOT, relativePath)

// 3. 您的路径现在更清晰了
export const Files = {
  /** 执行的目标 */
  TARGET: 'src/',
  /** 错误日志-TypeScript 错误 */
  ERR_TS: resolveFromRoot('dist/error-ts.log'),
  /** 错误日志-规范错误 */
  ERR_ESLINT: resolveFromRoot('dist/error-eslint.log'),
  /** 错误日志-最终格式 */
  ERR_LOG_JSON: resolveFromRoot('dist/error-log.json'),
}
