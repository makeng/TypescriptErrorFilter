import { FC } from 'react'
import './index.scss'
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Block from '../Block'
import { type ChartData, prefixCls, useBarClick, useWarningHistory } from './utils'
import BarPopover from './BarPopover'
import BarInfo from './BarInfo'

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
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const data = payload[0]?.payload as ChartData | undefined
              if (!data) return null
              return (
                <div style={{ backgroundColor: '#333', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: 12 }}>
                  <BarInfo data={data} hint="点击柱子可删除" />
                </div>
              )
            }}
          />
          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            onClick={(data, _index, e) => {
              const payload = data.payload as ChartData | undefined
              if (payload) select(payload.time, e.clientX, e.clientY)
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
