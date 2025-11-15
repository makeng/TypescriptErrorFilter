import { Color } from '../types'
import { Files } from './config'
import fs from 'fs/promises'
import { ERROR_GROUP_MAP } from '../../index'

const ANSI_COLOR_MAP = new Map<Color, string>([
  [Color.Red, '\x1b[91m'],
  [Color.Orange, '\x1b[38;5;208m'],
  [Color.Green, '\x1b[32m'],
  [Color.Cyan, '\x1b[36m'],
])

/**
 * Print colorful message
 */
export function consoleColor(color: Color, ...args: any[]) {
  return console.log(ANSI_COLOR_MAP.get(color), ...args)
}

/**
 * Read log files
 * @param logFiles
 */
export async function readLogsInTargetFolder(logFiles: string[]) {
  const res: string[] = [] // Split the file content into lines
  function pushIntoErrorLines(txt: string) {
    const lines = txt.split(/\S\n(?=\w+)/) // 将文件内容按行分割成数组
    lines.forEach((line) => {
      if (line.startsWith(Files.TARGET)) res.push(line)
    })
  }

  for (const file of logFiles) {
    await fs.readFile(file, { encoding: 'utf8' }).then(pushIntoErrorLines)
  }
  return res
}

/**
 * Create a map of grouped errors
 * @param errorLines
 */
export function creatGroupedMap(errorLines: string[]) {
  const allColors = Object.values(Color).reverse() // Place the most important color at the bottom for better readability.
  const res = new Map<Color, string[]>(allColors.map((color) => [color, []]))

  const collector = (line: string) =>
    ERROR_GROUP_MAP.forEach((fatalError, color) => {
      let isBreak = false
      fatalError.forEach(({ title, txtRegList }) => {
        if (isBreak) return
        txtRegList.forEach((reg) => {
          const targetListOfColor = res.get(color) as string[]
          if (reg.test(line)) {
            targetListOfColor.push(`${title}: ${line}`)
            isBreak = true
          }
        })
      })
    })
  errorLines.forEach(collector)
  return res
}
