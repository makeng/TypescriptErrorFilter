import { useEffect, useState } from 'react'
// ui
import '@arco-design/web-react/dist/css/arco.css'
import ChartOfPie from './components/ChartOfPie'
import Report from './components/Report'
import ChartOfBar from './components/ChartOfBar'
// fn
import { entries } from 'lodash-es'
import { Color } from '../filter/types'
// 使用 import 导入 JSON 文件 (Vite 支持)
import errorReportJson from '../dist/error-log.json'

export type DataItem = {
  name: string;
  value: number;
  color: Color;
  lines: string[];
}

// 定义 JSON 数据的类型
interface ErrorLogJson {
  [key: string]: string[];
}

function App() {
  const [color, setColor] = useState<Color>(Color.Red)

  const data = entries(errorReportJson as ErrorLogJson)
    .reverse()
    .map(([key, value]) => {
      const itemColor = key as Color
      return ({
        name: key,
        value: value.length,
        color: itemColor,
        lines: value,
      }) satisfies DataItem
    })

  // 计算当前警告总量
  const totalWarnings = data.reduce((sum, item) => sum + item.value, 0)

  useEffect(() => {
    window.document.body.setAttribute('arco-theme', 'dark') // 设置为暗黑主题
  }, [])

  console.log(data)
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
