import React, { ReactNode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { IconCheckSquare } from '@arco-design/web-react/icon'
import { EscapeStr } from '../../utils/const'

type MessageType = 'info' | 'success' | 'error' | 'warning';

interface MessageOptions {
  type: MessageType;
  content: string;
  duration?: number;
}

const messageQueue: MessageOptions[] = []

let container: HTMLDivElement | null = null
let root: ReturnType<typeof createRoot> | null = null

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<MessageOptions[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (messageQueue.length > 0) {
        const next = messageQueue.shift()!
        setMessages((prev) => [...prev, next])

        setTimeout(() => {
          setMessages((prev) => prev.slice(1))
        }, next.duration || 3000)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      {messages.map((msg, i) => (
        <div key={i} style={{ ...styles.message, ...styles[msg.type] }}>
          {iconMap.get(msg.type)}
          {EscapeStr.SPACE}
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
  ['success', <IconCheckSquare />],
])

const init = () => {
  if (!container) {
    container = document.createElement('div')
    window.document.body.appendChild(container)
    root = createRoot(container)
    root.render(<MessageList />)
  }
}

export const message = {
  info(content: string, duration?: number) {
    init()
    messageQueue.push({ type: 'info', content, duration })
  },
  success(content: string, duration?: number) {
    init()
    messageQueue.push({ type: 'success', content, duration })
  },
  error(content: string, duration?: number) {
    init()
    messageQueue.push({ type: 'error', content, duration })
  },
  warning(content: string, duration?: number) {
    init()
    messageQueue.push({ type: 'warning', content, duration })
  },
}
