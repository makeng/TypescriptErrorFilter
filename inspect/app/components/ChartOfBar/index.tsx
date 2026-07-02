import { FC } from 'react'
import './index.scss'
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Block from '../Block'
import { type ChartData, prefixCls, useWarningHistory } from './utils'
import BarTooltip from './Tooltip'

interface Props {
  totalWarnings: number;
  className?: string;
}

const Index: FC<Props> = (props) => {
  const { className, totalWarnings } = props
  const { history, remove } = useWarningHistory(totalWarnings)

  const chartData: ChartData[] = history.map((record, index) => ({
    ...record,
    delta: index > 0 ? record.total - history[index - 1].total : undefined,
  }))

  return (
    <Block className={className} contentClassName={prefixCls} title="History">
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} />
          <YAxis stroke="#888" fontSize={12} tickLine={false} allowDecimals={false} />
          <Tooltip
            wrapperStyle={{ pointerEvents: 'auto' }}
            content={(props) => <BarTooltip {...props} onRemove={remove} />}
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
