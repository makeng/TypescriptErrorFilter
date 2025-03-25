import path from 'path';

// 对应的目录
export const Files = {
  /** 执行的目标 */
  TARGET: 'src/',
  /** 错误日志-TypeScript 错误 */
  ERR_TS: path.resolve(__dirname, '../dist/error-ts.log'),
  /** 错误日志-规范错误 */
  ERR_ESLINT: path.resolve(__dirname, '../dist/error-eslint.log'),
  /** 错误日志-最终格式 */
  ERR_LOG_JSON: path.resolve(__dirname, '../dist/error-log.json'),
};

console.log(Files);
