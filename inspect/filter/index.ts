import * as fs from 'fs/promises';
import { FatalError, Color } from './types';
import { FATAL_ERRORS, Files } from './config';

/**
 * 日志文件的阅读器
 * @param data 文件内容
 */
function logFileReader(data: string) {
  const colorsReverted = Object.values(Color).reverse();
  const linesMap = new Map<Color, string[]>(colorsReverted.map((color) => [color, []])); // 找到的错误合集。按照颜色分类
  const lines = data.split(/\S\n(?=\w+)/); // 将文件内容按行分割成数组
  let cnt = 0;

  /**
   * 为每行创建的打印器
   * @param line
   */
  const createLogger = (line: string) => {
    return (item: FatalError) => {
      const {
        config: { title, color },
        txtRegList,
      } = item;
      const targetGroup = linesMap.get(color) || [];
      txtRegList.forEach((reg) => {
        const isInTargetFolder = line.startsWith(Files.TARGET);
        if (isInTargetFolder && reg.test(line)) {
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
  console.log(Color.Green, `筛选完成，共 ${cnt} 个`);
}

console.info('筛选出严重警告');
[Files.ERR_ESLINT, Files.ERR_TS].forEach((file) => {
  fs.readFile(file, { encoding: 'utf8' }).then(logFileReader);
});
