import { FC } from 'react'


interface Props {
  className?: string;
  color: string;
}

const Index: FC<Props> = ({ className, color }) => {
  return (
    <span>
      <i className={className} style={{ backgroundColor: color }} />{color}
    </span>
  )
}

export default Index
