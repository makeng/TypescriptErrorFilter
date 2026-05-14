import { FC } from 'react'
import './index.scss'
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Block from '../Block'
import { prefixCls, useWarningHistory, type HistoryRecord } from './utils'

interface Props {
  totalWarnings: number;
  className?: string;
}

interface ChartData extends HistoryRecord {
  delta?: number;
}

const Index: FC<Props> = (props) => {
  const { className, totalWarnings } = props
  const history = useWarningHistory(totalWarnings)

  // 计算每条记录相对前一条的变化量
  const chartData: ChartData[] = history.map((record, index) => ({
    ...record,
    delta: index > 0 ? record.total - history[index - 1].total : undefined,
  }))

  return (
    <Block className={className} contentClassName={prefixCls} title="History">
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="time"
            stroke="#888"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#888"
            fontSize={12}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const data = payload[0]?.payload as ChartData | undefined
              if (!data) return null
              const deltaColor = data.delta !== undefined
                ? data.delta > 0 ? '#ff4d4f' : data.delta < 0 ? '#52c41a' : '#888'
                : '#888'
              return (
                <div style={{ backgroundColor: '#333', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: 12 }}>
                  <p style={{ margin: 0 }}>时间: {label}</p>
                  <p style={{ margin: '4px 0 0' }}>警告数量: {data.total}</p>
                  {data.delta !== undefined && (
                    <p style={{ margin: '4px 0 0', color: deltaColor }}>
                      趋势: {data.delta > 0 ? '+' : ''}{data.delta}
                    </p>
                  )}
                </div>
              )
            }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.delta === undefined ? '#61dafb'
                  : entry.delta > 0 ? '#ff7875'
                  : entry.delta < 0 ? '#95de64'
                  : '#61dafb'
                }
              />
            ))}
          </Bar>
          <Line type="monotone" dataKey="total" stroke="#ff7300" dot={false} strokeWidth={2} strokeOpacity={0.6} />
        </ComposedChart>
      </ResponsiveContainer>
    </Block>
  )
}

export default Index
