import * as fs from 'fs/promises';

const ERR_LOG = './error.log';
const colorRed = '\x1b[91m';
const colorCyan = '\x1b[36m';
const colorOrange = '\x1b[38;5;208m';

// 此处增加检查的错误 <名字, 错误内容的一部分>
const FATAL_ERRORS = new Map([
  // 语法
  ['Cannot find name', { title: '变量缺失', color: colorRed }],
  ['Parsing error', { title: '编译错误', color: colorRed }],
  ['Duplicate', { title: '重复标识符', color: colorRed }],
  ['is possibly \'undefined\'', { title: '可能调用错误', color: colorCyan }],
  ['does not exist on', { title: '属性缺失', color: colorCyan }],
  ['has no initializer', { title: '未初始化', color: colorOrange }],
  ['not exported', { title: '没有导出', color: colorRed }],
  ['has no exported member', { title: '没有导出', color: colorRed }],
  ['Cannot assign to', { title: '赋值失败', color: colorRed }],
  ['can only be used in', { title: '调用错误', color: colorRed }],
  ['expected', { title: '代码不匹配', color: colorOrange }],
]);

/**
 * 日志文件的阅读器
 * @param data
 */
function logFileReader(data) {
  const groupMap = new Map<string, string[]>(); // 按照颜色分类
  const lines = data.split(/[^\s]\n(?=\w+)/); // 将文件内容按行分割成数组
  /**
   * 为每行创建的打印器
   * @param line
   * @return {(function(*, *): void)|*}
   */
  const createLogger = (line) => {
    return ({ title, color }, partialContent) => {
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
fs.readFile(ERR_LOG, { encoding: 'utf8' }).then(logFileReader);
