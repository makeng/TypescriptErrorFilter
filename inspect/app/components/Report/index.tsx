import { FC, useRef, useState } from 'react'
import './index.scss'
import { Color } from '../../../filter/utils'
import Block from '../Block'
import { DataItem } from '../../App'
import { createBEM } from '../../utils/bem'
import Line from './Line'
import { sleep } from '../../utils/time'

interface Props {
  color: Color;
  list: DataItem[];
}

const bem = createBEM('report')

const Index: FC<Props> = (props) => {
  const { list } = props
  const [hoverKey, setHoverKey] = useState('')
  const isHoverLocked = useRef(false)
  /**
   * 某一行的 hover 状态
   * @param key 行的标识
   * @param status hover 状态
   */
  function changeLineHover(key: string, status: boolean) {
    if (isHoverLocked.current) return
    const DELAY = 1000
    if (status) {
      // One hover at a time
      setHoverKey(key)
      isHoverLocked.current = true
    } else {
      setHoverKey(status ? key : '')
      sleep(DELAY).then(() => isHoverLocked.current = false)
    }
  }
  return (
    <Block className={bem()} title="Report">
      {list.map(({ color, lines }, index) => {
        return (
          <div key={color}>
            <span><i className={bem('dot')} style={{ backgroundColor: color }} />{color}</span>
            <ul>
              {lines.map((txt, subIndex) => {
                const key = `${index}-${subIndex}`
                return (
                  <Line
                    key={key} txt={txt} isHover={key === hoverKey}
                    onChangeHover={(status) => changeLineHover(key, status)}
                  />
                )
              })}
            </ul>
          </div>
        )
      })}
    </Block>
  )
}
export default Index
