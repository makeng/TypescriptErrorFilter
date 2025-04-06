import { FC, ReactNode } from 'react'
import './index.scss'
import classnames from 'classnames'
import { createBEM } from '../../utils/bem'

interface Props {
  className: string;
  title?: string;
  children: ReactNode;
}

const bem = createBEM('page-block')

const Index: FC<Props> = ({ title, className, children }) => {
  return (
    <div className={bem()}>
      {title && <div className={bem('title')}>{title}</div>}
      <div className={classnames(bem('content'), className)}>{children}</div>
    </div>
  )
}
export default Index
