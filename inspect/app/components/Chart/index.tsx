import { FC, MouseEvent } from 'react'
import './index.scss'
import { Cell, Pie, PieChart, PieLabelRenderProps, PieSectorDataItem } from 'recharts'
import Block from '../Block'
import { DataItem } from '../../App'

interface Props {
  list: DataItem[];
  onMouseEnterSection(item: DataItem): void;
}

const prefixCls = 'inspect-pie-chart'
const RADIAN = Math.PI / 180
const enum ChartSize {
  WIDTH = 500,
  HEIGHT = 250,
}

const Index: FC<Props> = (props) => {
  const { list } = props

  function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: PieLabelRenderProps) {
    const safeCx = cx ?? 0
    const safeCy = cy ?? 0
    const safeMidAngle = midAngle ?? 0
    const safeInnerRadius = innerRadius ?? 0
    const safeOuterRadius = outerRadius ?? 0
    const safePercent = percent ?? 0
    const safeIndex = index ?? 0

    const radius = safeInnerRadius + (safeOuterRadius - safeInnerRadius) + 30
    const x = safeCx + radius * Math.cos(-safeMidAngle * RADIAN)
    const y = safeCy + radius * Math.sin(-safeMidAngle * RADIAN)
    const percentStr = `${(safePercent * 100).toFixed(0)}%`
    const { value, color } = list[safeIndex] || {}
    return (
      <text x={x} y={y} fill="white" textAnchor={x > safeCx ? 'start' : 'end'} dominantBaseline="central">
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
          onMouseEnter={(_data: PieSectorDataItem, index: number, _e: MouseEvent<SVGGraphicsElement>) => {
            const item = list[index]
            if (item) {
              props.onMouseEnterSection(item)
            }
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
