import * as fs from 'fs/promises'
import { consoleColor, creatGroupedMap, readLogsInTargetFolder } from './utils'
import { Files } from './utils/config'

const DESC_IN_CLI = '筛选出严重警告，用时'

// Start the process
console.time(DESC_IN_CLI)
readLogsInTargetFolder([Files.ERR_TS, Files.ERR_ESLINT])
  .then((errorLines) => {
    const errorMap = creatGroupedMap(errorLines) // Group the lines by color

    // MS1: 输出到 cli
    const priintToCLI = () => new Promise<void>((resolve) => {
      errorMap.forEach((lines, color) => {
        consoleColor(color, lines.join('\n'))
      })
      resolve()
    })
    // MS2: 错误信息转化为 json 文件，让 localhost 整理输出网页
    const printToFile = () =>
      fs.writeFile(Files.ERR_LOG_JSON, JSON.stringify(Object.fromEntries(errorMap), null, 2))

    return Promise.all([priintToCLI(), printToFile()])
  })
  .finally(() => {
    console.timeEnd(DESC_IN_CLI)
  })

