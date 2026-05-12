import { FC, MouseEvent } from 'react'
import './index.scss'
import { Cell, Pie, PieChart, PieLabelRenderProps, PieSectorDataItem } from 'recharts'
import Block from '../Block'
import { DataItem } from '../../App'

interface Props {
  list: DataItem[];
  onMouseEnterSection(item: DataItem): void;
  className?: string;
}

const prefixCls = 'inspect-pie-chart'
const RADIAN = Math.PI / 180
const enum ChartSize {
  WIDTH = 500,
  HEIGHT = 250,
}

const Index: FC<Props> = ({ className, list, onMouseEnterSection }) => {
  function renderLabel({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0, index = 0 }: PieLabelRenderProps) {
    const radius = innerRadius + (outerRadius - innerRadius) + 30
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const { value, color } = list[index] ?? {}
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${color}: ${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    )
  }

  return (
    <Block className={className} contentClassName={prefixCls} title="Chart">
      <PieChart width={ChartSize.WIDTH} height={ChartSize.HEIGHT}>
        <Pie
          data={list}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          label={renderLabel}
          dataKey="value"
          onMouseEnter={(_data: PieSectorDataItem, index: number, _e: MouseEvent<SVGGraphicsElement>) => {
            const item = list[index]
            if (item) onMouseEnterSection(item)
          }}
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
