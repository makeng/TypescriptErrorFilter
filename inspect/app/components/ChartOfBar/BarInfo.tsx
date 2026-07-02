import { type FC } from 'react'
import { type ChartData, deltaColor } from './utils'

interface Props {
  data: ChartData;
  /** 底部提示文字，不传则不显示 */
  hint?: string;
}

const BarInfo: FC<Props> = ({ data, hint }) => (
  <>
    <p style={{ margin: 0 }}>{data.time}</p>
    <p style={{ margin: '4px 0 0' }}>警告数量: {data.total}</p>
    {data.delta !== undefined && (
      <p style={{ margin: '4px 0 0', color: deltaColor(data.delta) }}>
        趋势: {data.delta > 0 ? '+' : ''}{data.delta}
      </p>
    )}
    {hint && (
      <p style={{ margin: '4px 0 0', color: '#888', fontSize: 11 }}>{hint}</p>
    )}
  </>
)

export default BarInfo
