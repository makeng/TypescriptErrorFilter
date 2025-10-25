import React, { useState } from 'react'
import Toolbox from './Toolbox'
import { createBEM } from '../../../utils/bem'

interface Props {
  txt: string;
  isHover: boolean;
  onChangeHover: (isHover: boolean) => void;
}

const bem = createBEM('report-line')

/**
 * 一行错误信息
 */
const Index: React.FC<Props> = (props) => {
  const { txt, isHover } = props
  const [isToolboxShow, setIsToolboxShow] = useState(false)

  return (
    <Toolbox txt={txt} show={isToolboxShow} onChangeShow={setIsToolboxShow}>
      <li
        className={bem({ hover: isHover || isToolboxShow })}
        onMouseEnter={() => props.onChangeHover(true)}
        onMouseLeave={() => props.onChangeHover(false)}
      >{txt}</li>
    </Toolbox>
  )
}

export default Index
