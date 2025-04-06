import { FC } from 'react'
import './index.scss'
import { Cell, Pie, PieChart } from 'recharts'
import Block from '../Block'
import { DataItem } from '../../App'

interface Props {
  list: DataItem[];
  onMouseEnterSection(list: DataItem): void;
}

const prefixCls = 'inspect-pie-chart'
const RADIAN = Math.PI / 180
const enum ChartSize {
  WIDTH = 500,
  HEIGHT = 250,
}

const Index: FC<Props> = (props) => {
  const { list } = props

  function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) {
    const radius = innerRadius + (outerRadius - innerRadius) + 30
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const percentStr = `${(percent * 100).toFixed(0)}%`
    const { value, color } = list[index] || {}
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${color}: ${value} (${percentStr})`}
      </text>
    )
  }

  return (
    <Block className={prefixCls} title="Chart">
      <PieChart width={ChartSize.WIDTH} height={ChartSize.HEIGHT}>
        <Pie
          data={list}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          label={renderLabel}
          dataKey="value"
          onMouseEnter={props.onMouseEnterSection}
        >
          {list.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </Block>
  )
}
export default Index
