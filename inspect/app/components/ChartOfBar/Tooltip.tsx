import { type FC } from 'react'
import { Button } from '@arco-design/web-react'
import { type ChartData } from './utils'

interface Props {
  active?: boolean;
  payload?: Array<{ payload: ChartData }>;
  onRemove: (time: string) => void;
}

const BarTooltip: FC<Props> = ({ active, payload, onRemove }) => {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null
  const deltaColor = data.delta !== undefined
    ? data.delta > 0 ? '#ff4d4f' : data.delta < 0 ? '#52c41a' : '#888'
    : '#888'
  return (
    <div style={{
      backgroundColor: '#333', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: 12,
    }}>
      <p style={{ margin: 0 }}>时间: {data.time}</p>
      <p style={{ margin: '4px 0 0' }}>警告数量: {data.total}</p>
      {data.delta !== undefined && (
        <p style={{ margin: '4px 0 0', color: deltaColor }}>
          趋势: {data.delta > 0 ? '+' : ''}{data.delta}
        </p>
      )}
      <br />
      <Button
        type="outline"
        status="danger"
        size="mini"
        onClick={() => onRemove(data.time)}
      >
        Delete
      </Button>
    </div>
  )
}

export default BarTooltip
