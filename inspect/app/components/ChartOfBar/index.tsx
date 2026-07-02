import { FC } from 'react'
import './index.scss'
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Block from '../Block'
import { type ChartData, prefixCls, useBarClick, useWarningHistory } from './utils'
import BarPopover from './BarPopover'

interface Props {
  totalWarnings: number;
  className?: string;
}

const Index: FC<Props> = (props) => {
  const { className, totalWarnings } = props
  const { history, remove } = useWarningHistory(totalWarnings)
  const { clicked, select, clear } = useBarClick()

  const chartData: ChartData[] = history.map((record, index) => ({
    ...record,
    delta: index > 0 ? record.total - history[index - 1].total : undefined,
  }))

  const selectedData = clicked ? chartData.find(d => d.time === clicked.time) ?? null : null

  const handleRemove = (time: string) => {
    remove(time)
    clear()
  }

  return (
    <Block className={className} contentClassName={prefixCls} title="History">
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} />
          <YAxis stroke="#888" fontSize={12} tickLine={false} allowDecimals={false} />
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
                  <p style={{ margin: '4px 0 0', color: '#888', fontSize: 11 }}>点击柱子可删除</p>
                </div>
              )
            }}
          />
          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            onClick={(data: ChartData, _index: number, e: React.MouseEvent) => {
              select(data.time, e.clientX, e.clientY)
            }}
            style={{ cursor: 'pointer' }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.delta === undefined ? '#61dafb'
                    : entry.delta > 0 ? '#ff7875'
                      : entry.delta < 0 ? '#95de64'
                        : '#61dafb'
                }
                opacity={clicked && entry.time !== clicked.time ? 0.4 : 1}
              />
            ))}
          </Bar>
          <Line type="monotone" dataKey="total" stroke="#ff7300" dot={false} strokeWidth={2} strokeOpacity={0.6} />
        </ComposedChart>
      </ResponsiveContainer>
      <BarPopover
        clicked={clicked}
        data={selectedData}
        onClose={clear}
        onRemove={handleRemove}
      />
    </Block>
  )
}

export default Index
