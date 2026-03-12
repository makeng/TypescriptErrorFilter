import { FC, ReactNode } from 'react'
import './index.scss'
import { clsx } from 'clsx'
import { createBEM } from '../../utils/bem'

interface Props {
  className?: string;
  contentClassName: string;
  title?: string;
  children: ReactNode;
}

const bem = createBEM('page-block')

/**
 * 块级组件。纯样式，就是卡片的外层
 */
const Index: FC<Props> = ({ title, className, contentClassName, children }) => {
  return (
    <div className={clsx(bem(), className)}>
      {title && <div className={bem('title')}>{title}</div>}
      <div className={clsx(bem('content'), contentClassName)}>{children}</div>
    </div>
  )
}
export default Index
