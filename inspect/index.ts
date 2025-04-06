// 此处增加检查的错误 <错误内容的一部分字符, 标注的格式>
import { Color, FatalError } from './filter/utils'

export const ERROR_GROUP_MAP = new Map<Color, FatalError[]>([
  [
    Color.Red,
    [
      new FatalError('模块丢失', [/not exported/i, /has .+ export.+/i, /Cannot find module/i]),
      new FatalError('编译错误', [/Parsing error/i]),
      new FatalError('重复标识符', [/Duplicate/i, /multiple properties/i]),
      new FatalError('调用错误', [/Cannot assign to/i, /can only be/i]),
      // 业务-长期检查
      new FatalError('重要类型错误', [
        /CookieKey|TabType/,
        /not exist on type 'typeof (FieldKey|FundBillType|OrderBillType)/,
      ]),
    ],
  ],
  [
    Color.Orange,
    [
      new FatalError('未初始化', [/has no initializer/i]),
      new FatalError('代码不匹配', [/expected/i, /Don't use/i]),
      new FatalError('变量缺失', [/Cannot find name/i, /not exist on/i, /required in/i]),
    ],
  ],
  [
    Color.Cyan,
    [
      new FatalError('可能调用错误', [/is possibly/i]),
    ],
  ],
])
