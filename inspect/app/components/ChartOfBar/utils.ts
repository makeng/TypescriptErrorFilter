import { useCallback, useEffect, useState } from 'react'
import { StorageSpace } from '@/utils/storage.ts'

export interface HistoryRecord {
  time: string;
  total: number;
}

export const prefixCls = 'inspect-bar-chart'
const MAX_HISTORY = 100

export interface ChartData extends HistoryRecord {
  delta?: number;
}

// 用宿主项目名做命名空间，避免多项目历史数据混合
const projectName = import.meta.env.VITE_PROJECT_NAME || 'default'
const storageKey = `${prefixCls}-${projectName}`

// 创建命名空间实例
const storage = new StorageSpace<HistoryRecord[]>(storageKey, [])

function formatTime(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 从 localStorage 加载历史记录
 */
function loadHistory(): HistoryRecord[] {
  return storage.get()
}

/**
 * 保存历史记录到 localStorage
 */
function saveHistory(history: HistoryRecord[]) {
  storage.set(history)
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

  // 使用 Map 去重（同一分钟内的记录只保留最新的，key 包含年月日时分）
  const historyMap = new Map<string, HistoryRecord>(
    [...history, newRecord].map(r => [r.time, r]),
  )

  // 转换为数组，保留最近 MAX_HISTORY 条
  return [...historyMap.values()].slice(-MAX_HISTORY)
}

function removeRecord(history: HistoryRecord[], time: string): HistoryRecord[] {
  return history.filter(r => r.time !== time)
}

/**
 * Hook: 管理历史警告记录
 * @param totalWarnings 当前警告总量
 * @returns history 历史记录数组, remove 删除指定记录
 */
export function useWarningHistory(totalWarnings: number) {
  const [history, setHistory] = useState<HistoryRecord[]>([])

  useEffect(() => {
    const loadedHistory = loadHistory()
    const updatedHistory = addRecord(loadedHistory, totalWarnings)
    setHistory(updatedHistory)
    saveHistory(updatedHistory)
  }, [totalWarnings])

  const remove = useCallback((time: string) => {
    setHistory(prev => {
      const updated = removeRecord(prev, time)
      saveHistory(updated)
      return updated
    })
  }, [])

  return { history, remove }
}

export interface ClickState {
  time: string;
  x: number;
  y: number;
}

/**
 * Hook: 管理柱子点击选中态（含屏幕坐标）
 * @returns clicked 当前选中信息, select 选中, clear 清除
 */
export function useBarClick() {
  const [clicked, setClicked] = useState<ClickState | null>(null)
  const select = useCallback((time: string, x: number, y: number) => {
    setClicked(prev => prev?.time === time ? null : { time, x, y })
  }, [])
  const clear = useCallback(() => setClicked(null), [])
  return { clicked, select, clear }
}
