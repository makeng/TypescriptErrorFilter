import { type FC, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@arco-design/web-react'
import { type ChartData, type ClickState } from './utils'
import BarInfo from './BarInfo'

interface Props {
  clicked: ClickState | null;
  data: ChartData | null;
  onClose: () => void;
  onRemove: (time: string) => void;
}

const PANEL_WIDTH = 180

const BarPopover: FC<Props> = ({ clicked, data, onClose, onRemove }) => {
  const ref = useRef<HTMLDivElement>(null)

  // 点击面板外部关闭
  useEffect(() => {
    if (!clicked) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [clicked, onClose])

  if (!clicked || !data) return null

  // 计算面板位置：显示在点击位置正下方，水平居中
  const left = Math.max(8, clicked.x - PANEL_WIDTH / 2)
  const top = clicked.y + 12

  return createPortal(
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left,
        top,
        width: PANEL_WIDTH,
        backgroundColor: '#2a2a2a',
        border: '1px solid #444',
        borderRadius: 6,
        padding: '10px 12px',
        color: '#fff',
        fontSize: 12,
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      <BarInfo data={data} />
      <Button
        type="outline"
        status="danger"
        size="mini"
        style={{ marginTop: 8, width: '100%' }}
        onClick={() => onRemove(data.time)}
      >
        删除此记录
      </Button>
    </div>,
    document.body,
  )
}

export default BarPopover
