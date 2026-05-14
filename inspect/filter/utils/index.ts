import { Color } from '../types'
import { Files } from './config'
import fs from 'fs/promises'
import { ERROR_GROUP_MAP } from '../../index'

const ANSI_COLOR_MAP: Record<Color, string> = {
  [Color.Red]: '\x1b[91m',
  [Color.Orange]: '\x1b[38;5;208m',
  [Color.Green]: '\x1b[32m',
  [Color.Cyan]: '\x1b[36m',
}

/** Print colorful message */
export function consoleColor(color: Color, ...args: unknown[]) {
  const ansiCode = ANSI_COLOR_MAP[color]
  if (ansiCode) {
    console.log(ansiCode, ...args)
  }
}

/** Read log files and extract lines starting with TARGET prefix */
export async function readLogsInTargetFolder(logFiles: string[]) {
  const contents = await Promise.all(
    logFiles.map(async file => {
      try {
        return await fs.readFile(file, { encoding: 'utf8' })
      } catch {
        return '' // 文件不存在时跳过，兼容日志开关切换
      }
    }),
  )
  return contents.flatMap(txt =>
    txt.split('\n').filter(line => line.startsWith(Files.TARGET)),
  )
}

/**
 * Create a map of grouped errors.
 * Each line matches at most ONE error pattern (first match wins, by color priority).
 */
export function creatGroupedMap(errorLines: string[]) {
  const res = new Map<Color, string[]>(
    Object.values(Color).reverse().map(color => [color, [] as string[]]),
  )

  for (const line of errorLines) {
    let matched = false
    for (const [color, fatalErrors] of ERROR_GROUP_MAP) {
      if (matched) break
      for (const { title, txtRegList } of fatalErrors) {
        if (matched) break
        for (const reg of txtRegList) {
          if (reg.test(line)) {
            res.get(color)!.push(`${title}: ${line}`)
            matched = true
            break
          }
        }
      }
    }
  }

  return res
}
