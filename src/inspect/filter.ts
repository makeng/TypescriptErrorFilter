import fs from 'fs/promises';

const ERR_LOG = './error.log';
const colorRed = '\x1b[91m';
const colorCyan = '\x1b[36m';
const colorOrange = '\x1b[38;5;208m';

// 此处增加检查的错误 <名字, 错误内容的一部分>
const FATAL_ERRORS = new Map([
  // 语法
  ['Cannot find name', { title: '变量缺失', color: colorRed }],
  ['Duplicate identifier', { title: '重复变量', color: colorRed }],
  ['is possibly \'undefined\'', { title: '可能调用错误', color: colorCyan }],
  ['has no initializer', { title: '未初始化', color: colorOrange }],
  ['not exported', { title: '没有导出', color: colorRed }],
  ['has no exported member', { title: '没有导出', color: colorRed }],
  ['Cannot assign to', { title: '赋值失败', color: colorRed }],
  // 业务逻辑
  ['does not exist on type \'typeof FieldKey\'', { title: '列设置错误', color: colorRed }],
  ['checkField', { title: '字段权限错误', color: colorRed }],
  ['checkRight', { title: '功能权限错误', color: colorRed }],
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
