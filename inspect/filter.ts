import * as fs from 'fs/promises';

enum Color {
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
const FATAL_ERRORS = new Map<string, Highlight>([
  ['Cannot find name', { title: '变量缺失', color: Color.Red }],
  ['Parsing error', { title: '编译错误', color: Color.Red }],
  ['Duplicate', { title: '重复标识符', color: Color.Red }],
  ['is possibly \'undefined\'', { title: '可能调用错误', color: Color.Cyan }],
  ['exist on', { title: '属性缺失', color: Color.Cyan }],
  ['has no initializer', { title: '未初始化', color: Color.Orange }],
  ['not exported', { title: '没有导出', color: Color.Red }],
  ['has no exported member', { title: '没有导出', color: Color.Red }],
  ['Cannot assign to', { title: '赋值失败', color: Color.Red }],
  ['can only be', { title: '调用错误', color: Color.Red }],
  ['only allow', { title: '调用错误', color: Color.Red }],
  ['expected', { title: '代码不匹配', color: Color.Orange }],
  ['Don\'t use', { title: '代码不匹配', color: Color.Orange }],
  ['is missing', { title: '代码缺失', color: Color.Orange }], // 太多了，后续再开启
]);


/**
 * 日志文件的阅读器
 * @param data 文件内容
 */
function logFileReader(data: string) {
  const groupMap = new Map<string, string[]>(); // 按照颜色分类
  const lines = data.split(/[^\s]\n(?=\w+)/); // 将文件内容按行分割成数组
  /**
   * 为每行创建的打印器
   * @param line
   */
  const createLogger = (line: string) => {
    return (highlight: Highlight, partialContent: string) => {
      const { title, color } = highlight;
      const targetGroup = groupMap.get(color) || [];
      const lineLower = line.toLowerCase();
      const findTxt = partialContent.toLowerCase();
      // 处理每一行的逻辑
      if (lineLower.includes(findTxt)) {
        targetGroup.push(`${title}: ${line}`);
        groupMap.set(color, targetGroup);
      }
    };
  };
  // 遍历每一行
  lines.forEach((line) => {
    FATAL_ERRORS.forEach(createLogger(line));
  });
  groupMap.forEach((group, color) => {
    console.log(color, group.join('\r\n'));
  });
}

console.info('筛选出严重警告');
fs.readFile(ERR_LOG_FILE, { encoding: 'utf8' }).then(logFileReader);
