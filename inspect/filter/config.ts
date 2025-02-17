import path from 'path';
import { Color, FatalError } from './types';

// 此处增加检查的错误 <错误内容的一部分字符, 标注的格式>
export const ERROR_GROUP_MAP = new Map<Color, FatalError[]>([
  [Color.Red, [
    {
      title: '代码缺失',
      txtRegList: [/Cannot find module/i],
    },
    {
      title: '编译错误',
      txtRegList: [/Parsing error/i],
    },
    {
      title: '重复标识符',
      txtRegList: [/Duplicate/i],
    },
    {
      title: '没有导出',
      txtRegList: [/not exported/i, /has no exported member/i],
    },
    {
      title: '调用错误',
      txtRegList: [/Cannot assign to/i, /can only be/i],
    },
  ]],
  [Color.Orange, [
    {
      title: '未初始化',
      txtRegList: [/has no initializer/i],
    },
    {
      title: '代码不匹配',
      txtRegList: [/expected/i, /Don't use/i],
    },
  ]],
  [Color.Cyan, [
    {
      title: '变量缺失',
      txtRegList: [/Cannot find name/i, /not exist on/i, /required in/i],
    },
    {
      title: '可能调用错误',
      txtRegList: [/is possibly/i],
    },
  ]],
]);

// 对应的目录
export const Files = {
  /** 执行的目标 */
  TARGET: 'src/',
  /** 错误日志-TypeScript 错误 */
  ERR_TS: path.resolve(__dirname, '../dist/error-ts.log'),
  /** 错误日志-规范错误 */
  ERR_ESLINT: path.resolve(__dirname, '../dist/error-eslint.log'),
};
