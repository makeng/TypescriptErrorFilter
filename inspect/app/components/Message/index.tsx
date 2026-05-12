import { ReactNode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { IconCheckSquare } from '@arco-design/web-react/icon'

export type MessageType = 'info' | 'success' | 'error' | 'warning'

interface MessageOptions {
  type: MessageType
  content: string
  duration?: number
}

let addMessageFn: ((msg: MessageOptions) => void) | null = null
let container: HTMLDivElement | null = null
let root: ReturnType<typeof createRoot> | null = null

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<MessageOptions[]>([])

  useEffect(() => {
    addMessageFn = (msg) => {
      setMessages((prev) => [...prev, msg])
      setTimeout(() => {
        setMessages((prev) => prev.filter(m => m !== msg))
      }, msg.duration ?? 3000)
    }
    return () => { addMessageFn = null }
  }, [])

  return (
    <div style={styles.container}>
      {messages.map((msg, i) => (
        <div key={i} style={{ ...styles.message, ...styles[msg.type] }}>
          {iconMap.get(msg.type)}
          {'\xa0'}
          {msg.content}
        </div>
      ))}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  message: {
    padding: '10px 16px',
    borderRadius: '6px',
    color: 'white',
    minWidth: '200px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: '14px',
  },
  info: { backgroundColor: '#1890ff' },
  success: { backgroundColor: '#52c41a' },
  error: { backgroundColor: '#ff4d4f' },
  warning: { backgroundColor: '#faad14' },
}

const iconMap = new Map<MessageType, ReactNode>([
  ['success', <IconCheckSquare key="success-icon" />],
])

const init = () => {
  if (!container) {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    root.render(<MessageList />)
  }
}

const push = (type: MessageType, content: string, duration?: number) => {
  init()
  addMessageFn?.({ type, content, duration })
}

export const message = {
  info: (content: string, duration?: number) => push('info', content, duration),
  success: (content: string, duration?: number) => push('success', content, duration),
  error: (content: string, duration?: number) => push('error', content, duration),
  warning: (content: string, duration?: number) => push('warning', content, duration),
}
