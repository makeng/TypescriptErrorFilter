const fs = require('fs/promises');

const ERR_LOG = './error.log';
// 此处增加检查的错误 <名字, 错误内容的一部分>
const FATAL_ERRORS = new Map([
  ['变量缺失', 'Cannot find name'],
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
    return (warning, key) => {
      if (line.includes(warning))
        // 处理每一行的逻辑
        console.log(`${key}: `, line);
    };
  };

  // 遍历每一行
  lines.forEach((line) => {
    FATAL_ERRORS.forEach(createLogger(line));
  });
}

console.info('筛选出严重警告');
fs.readFile(ERR_LOG, { encoding: 'utf8' }).then(logFileReader);
