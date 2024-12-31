import * as fs from 'fs/promises';

enum Color {
  Green = '\x1b[32m',
  Red = '\x1b[91m',
  Cyan = '\x1b[36m',
  Orange = '\x1b[38;5;208m',
}
interface Highlight {
  title: string;
  color: Color;
}

const ERR_LOG_FILE = './error.log';

// 此处增加检查的错误 <错误内容的一部分字符, 标注的格式>
const FATAL_ERRORS = new Map<string[], Highlight>([
  // 语法
  [['Cannot find name', 'exist on', 'required in'], { title: '代码缺失', color: Color.Cyan }],
  [['Parsing error'], { title: '编译错误', color: Color.Red }],
  [['Duplicate'], { title: '重复标识符', color: Color.Red }],
  [['is possibly \'undefined'], { title: '可能调用错误', color: Color.Cyan }],
  [['has no initializer'], { title: '未初始化', color: Color.Orange }],
  [['not exported', 'has no exported member'], { title: '没有导出', color: Color.Red }],
  [['Cannot assign to', 'can only be', 'only allow'], { title: '调用错误', color: Color.Red }],
  [['expected', 'Don\'t use'], { title: '代码不匹配', color: Color.Orange }],
  // 业务（此处为例子）
  [['auth', 'login'], { title: '权限错误', color: Color.Orange }],
]);

/**
 * 日志文件的阅读器
 * @param data 文件内容
 */
function logFileReader(data: string) {
  const linesMap = new Map<Color, string[]>(); // 找到的错误合集。按照颜色分类
  const lines = data.split(/\S\n(?=\w+)/); // 将文件内容按行分割成数组
  let cnt = 0;
  /**
   * 为每行创建的打印器
   * @param line
   */
  const createLogger = (line: string) => {
    return (highlight: Highlight, partialContents: string[]) => {
      const { title, color } = highlight;
      const targetGroup = linesMap.get(color) || [];
      const lineLower = line.toLowerCase();
      partialContents.forEach((txt) => {
        const findTxt = txt.toLowerCase();
        if (lineLower.includes(findTxt)) {
          targetGroup.push(`${title}: ${line}`);
          linesMap.set(color, targetGroup);
          cnt += 1;
        }
      });
    };
  };
  // 遍历每一行
  lines.forEach((line) => {
    FATAL_ERRORS.forEach(createLogger(line));
  });
  linesMap.forEach((lines, color) => {
    console.log(color, lines.join('\r\n'));
  });
  console.log(Color.Green, `共 ${cnt} 个`);
}

console.info('筛选出严重警告');
fs.readFile(ERR_LOG_FILE, { encoding: 'utf8' }).then(logFileReader);
