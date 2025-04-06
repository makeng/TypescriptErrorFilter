import React, { useState } from 'react'
import Toolbox from './Toolbox'
import { createBEM } from '../../../utils/bem'

interface Props {
  txt: string;
}

const bem = createBEM('report-line')

const Index: React.FC<Props> = (props) => {
  const { txt } = props
  const [isHover, setIsHover] = useState(false)
  const [isToolboxShow, setIsToolboxShow] = useState(false)

  return (
    <Toolbox txt={txt} show={isToolboxShow} onChangeShow={setIsToolboxShow}>
      <li
        className={bem({ hover: isHover || isToolboxShow })}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >{txt}</li>
    </Toolbox>
  )
}

export default Index
