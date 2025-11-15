import * as fs from 'fs/promises'
import { consoleColor, creatGroupedMap, readLogsInTargetFolder } from './utils'
import { Files } from './utils/config'
import { Color } from './types'

consoleColor(Color.Green, '筛选出严重警告')
readLogsInTargetFolder([Files.ERR_TS, Files.ERR_ESLINT]).then((errorLines) => {
  const errorMap = creatGroupedMap(errorLines) // Group the lines by color
  // 命令行中输出错误信息
  errorMap.forEach((lines, color) => consoleColor(color, lines.join('\n')))
  // 错误信息转化为 json 文件，让 server 端整理输出网页
  fs.writeFile(Files.ERR_LOG_JSON, JSON.stringify(Object.fromEntries(errorMap), null, 2))
})

