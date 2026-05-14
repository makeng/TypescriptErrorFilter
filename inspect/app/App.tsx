import { useEffect, useState } from 'react'
// ui
import '@arco-design/web-react/dist/css/arco.css'
import ChartOfPie from './components/ChartOfPie'
import Report from './components/Report'
import ChartOfBar from './components/ChartOfBar'
// fn
import { Color } from '../filter/types'
// 使用 import 导入 JSON 文件 (Vite 支持)
import errorReportJson from '../dist/error-log.json'

export type DataItem = {
  name: string;
  value: number;
  color: Color;
  lines: string[];
}

function App() {
  const [color, setColor] = useState<Color>(Color.Red)

  const data = Object.entries(errorReportJson as Record<string, string[]>)
    .reverse()
    .map(([key, value]) => ({
      name: key,
      value: value.length,
      color: key as Color,
      lines: value,
    }) satisfies DataItem)

  const totalWarnings = data.reduce((sum, item) => sum + item.value, 0)

  useEffect(() => {
    document.body.setAttribute('arco-theme', 'dark')
    const projectName = import.meta.env.VITE_PROJECT_NAME
    if (projectName) {
      document.title = `${projectName} - 错误报告`
    }
  }, [])

  return (
    <div className="app">
      <div className="flex">
        <ChartOfPie className="flex-1" list={data} onMouseEnterSection={({ color }) => setColor(color)} />
        <ChartOfBar className="flex-1" totalWarnings={totalWarnings} />
      </div>
      <Report color={color} list={data} />
    </div>
  )
}

export default App
