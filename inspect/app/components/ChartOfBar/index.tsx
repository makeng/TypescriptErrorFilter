import { FC } from 'react'
import './index.scss'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Block from '../Block'
import { prefixCls, useWarningHistory } from './utils'

interface Props {
  totalWarnings: number;
}

const Index: FC<Props> = (props) => {
  const { totalWarnings } = props
  const history = useWarningHistory(totalWarnings)

  return (
    <Block className={prefixCls} title="History">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            contentStyle={{
              backgroundColor: '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
            }}
            formatter={(value) => [`警告数量: ${value}`, '']}
            labelFormatter={(label) => `时间: ${label}`}
          />
          <Bar
            dataKey="total"
            fill="#61dafb"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </Block>
  )
}

export default Index
