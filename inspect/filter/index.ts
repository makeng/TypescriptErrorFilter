import * as fs from 'fs/promises';
import { Color } from './types';
import { ERROR_GROUP_MAP, Files } from './config';

/* ----------------------------------------- main ----------------------------------------- */
console.info('筛选出严重警告');
readLogsInTargetFolder([Files.ERR_TS, Files.ERR_ESLINT]).then(errorLines => {
  const errorMap = creatGroupedMap(errorLines); // Group the lines by color
  errorMap.forEach((lines, color) => {
    console.info(color, lines.join('\r\n'));
  });
});


/* ----------------------------------------- utils ----------------------------------------- */
async function readLogsInTargetFolder(logFiles: string[]) {
  const res: string[] = []; // Split the file content into lines
  function pushIntoErrorLines(txt: string) {
    const lines = txt.split(/\S\n(?=\w+)/); // 将文件内容按行分割成数组
    lines.forEach((line) => {
      if (line.startsWith(Files.TARGET))
        res.push(line);
    });
  }

  for (const file of logFiles) {
    await fs.readFile(file, { encoding: 'utf8' }).then(pushIntoErrorLines);
  }
  return res;
}

function creatGroupedMap(errorLines: string[]) {
  const allColors = Object.values(Color).reverse(); // Place the most important color at the bottom for better readability.
  const res = new Map<Color, string[]>(allColors.map((color) => [color, []]));

  const collector = (line: string) =>
    ERROR_GROUP_MAP.forEach((itemList, color) => {
      itemList.forEach(({ title, txtRegList }) => {
        txtRegList.forEach((reg) => {
          const targetListOfColor = res.get(color) as string [];
          if (reg.test(line)) {
            targetListOfColor.push(`${title}: ${line}`);
          }
        });
      });
    });
  errorLines.forEach(collector);
  return res;
}
