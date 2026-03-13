import { useEffect, useState } from 'react'
import { StorageSpace } from '@/utils/storage.ts'

export interface HistoryRecord {
  time: string;
  total: number;
}

export const prefixCls = 'inspect-bar-chart'
const MAX_HISTORY = 100

// 创建命名空间实例
const storage = new StorageSpace(prefixCls)

function formatTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 从 localStorage 加载历史记录
 */
function loadHistory(): HistoryRecord[] {
  return storage.get<HistoryRecord[]>('history', []) ?? []
}

/**
 * 保存历史记录到 localStorage
 */
function saveHistory(history: HistoryRecord[]) {
  storage.set('history', history)
}

/**
 * 添加新记录并返回更新后的历史记录
 */
function addRecord(history: HistoryRecord[], total: number) {
  const now = new Date()
  const newRecord: HistoryRecord = {
    time: formatTime(now),
    total,
  }

  // 使用 Map 去重（同一分钟内的记录只保留最新的）
  const historyMap = new Map<string, HistoryRecord>(
    [...history, newRecord].map(r => [r.time, r]),
  )

  // 转换为数组，保留最近 MAX_HISTORY 条
  return [...historyMap.values()].slice(-MAX_HISTORY)
}

/**
 * Hook: 管理历史警告记录
 * @param totalWarnings 当前警告总量
 * @returns 历史记录数组
 */
export function useWarningHistory(totalWarnings: number) {
  const [history, setHistory] = useState<HistoryRecord[]>([])

  useEffect(() => {
    // 从 localStorage 加载历史记录
    const loadedHistory = loadHistory()

    // 添加当前执行记录
    const updatedHistory = addRecord(loadedHistory, totalWarnings)

    setHistory(updatedHistory)
    saveHistory(updatedHistory)
  }, [totalWarnings])

  return history
}
