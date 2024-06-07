import fs from 'fs/promises';

const ERR_LOG = './error.log';
const colorRed = '\x1b[91m';
const colorCyan = '\x1b[36m';
const colorYellow = '\x1b[43m';

// 此处增加检查的错误 <名字, 错误内容的一部分>
const FATAL_ERRORS = new Map([
  ['Cannot find name', { title: '变量缺失', color: colorRed }],
  ['is possibly \'undefined\'', { title: '空值警告', color: colorCyan }],
  ['not exported', { title: '没有导出', color: colorYellow }],
]);

/**
 * 日志文件的阅读器
 * @param data
 */
function logFileReader(data) {
  const lines = data.split('\n'); // 将文件内容按行分割成数组
  /**
   * 为每行创建的打印器
   * @param line
   * @return {(function(*, *): void)|*}
   */
  const createLogger = (line) => {
    return ({ title, color }, partialContent) => {
      // 处理每一行的逻辑
      if (line.includes(partialContent))
        console.log(color, `${title}: ${line}`);
    };
  };
  // 遍历每一行
  lines.forEach((line) => {
    FATAL_ERRORS.forEach(createLogger(line));
  });
}

console.info('筛选出严重警告');
fs.readFile(ERR_LOG, { encoding: 'utf8' }).then(logFileReader);
