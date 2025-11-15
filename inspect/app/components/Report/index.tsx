import { FC, useEffect, useRef, useState } from 'react'
import './index.scss'
import Block from '../Block'
import { DataItem } from '../../App'
import { createBEM } from '../../utils/bem'
import Line from './Line'
import { sleep } from '../../utils/time'
import Dot from './Dot'
import { Color } from '../../../filter/types'

interface Props {
  color: Color;
  list: DataItem[];
}

const bem = createBEM('report')

const Index: FC<Props> = (props) => {
  const { list } = props
  const [hoverKey, setHoverKey] = useState('')
  const isHoverLocked = useRef(false) // One hover at a time

  /**
   * 某一行的 hover 状态
   * @param key 行的标识
   * @param status hover 状态
   */
  function changeLineHover(key: string, status: boolean) {
    // 存在正在 hover 的行时，不允许其他行 hover
    if (key !== hoverKey && isHoverLocked.current) return

    setHoverKey(status ? key : '')
  }

  useEffect(() => {
    if (hoverKey) {
      isHoverLocked.current = true
    } else {
      const DELAY = 1000
      sleep(DELAY).then(() => isHoverLocked.current = false)
    }
  }, [hoverKey])

  return (
    <Block className={bem()} title="Report">
      {list.map(({ color, lines }, index) => {
        return (
          <div key={color}>
            <Dot className={bem('dot')} color={color} />
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
