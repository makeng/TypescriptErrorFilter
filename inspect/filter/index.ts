import fs from 'fs/promises'
import { consoleColor, creatGroupedMap, readLogsInTargetFolder } from './utils'
import { Files } from './utils/config'

const DESC_IN_CLI = '筛选出严重警告，用时'

// Start the process
console.time(DESC_IN_CLI)
readLogsInTargetFolder([Files.ERR_TS, Files.ERR_ESLINT])
  .then((errorLines) => {
    const errorMap = creatGroupedMap(errorLines)

    // 输出到 CLI
    errorMap.forEach((lines, color) => consoleColor(color, lines.join('\n')))

    // 输出到 JSON，让 localhost 整理输出网页
    return fs.writeFile(Files.ERR_LOG_JSON, JSON.stringify(Object.fromEntries(errorMap), null, 2))
  })
  .finally(() => console.timeEnd(DESC_IN_CLI))
