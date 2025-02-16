import { Color, FatalError } from './types';

// 此处增加检查的错误 <错误内容的一部分字符, 标注的格式>
export const FATAL_ERRORS = [
  // 语法错误
  {
    txtRegList: [/Cannot find name/i, /not exist on/i, /required in/i],
    config: { title: '变量缺失', color: Color.Cyan },
  },
  {
    txtRegList: [/Cannot find module/i],
    config: { title: '代码缺失', color: Color.Red },
  },
  {
    txtRegList: [/Parsing error/i],
    config: { title: '编译错误', color: Color.Red },
  },
  {
    txtRegList: [/Duplicate/i],
    config: { title: '重复标识符', color: Color.Red },
  },
  {
    txtRegList: [/is possibly/i],
    config: { title: '可能调用错误', color: Color.Cyan },
  },
  {
    txtRegList: [/has no initializer/i],
    config: { title: '未初始化', color: Color.Orange },
  },
  {
    txtRegList: [/not exported/i, /has no exported member/i],
    config: { title: '没有导出', color: Color.Red },
  },
  {
    txtRegList: [/Cannot assign to/i, /can only be/i],
    config: { title: '调用错误', color: Color.Red },
  },
  {
    txtRegList: [/expected/i, /Don't use/i],
    config: { title: '代码不匹配', color: Color.Orange },
  },
] satisfies FatalError[];


// 对应的目录
export enum Files {
  /** 执行的目标 */
  TARGET = 'src/',
  /** 错误日志-TypeScript 错误 */
  ERR_TS = './dist/error-ts.log',
  /** 错误日志-规范错误 */
  ERR_ESLINT = './dist/error-eslint.log'
}
