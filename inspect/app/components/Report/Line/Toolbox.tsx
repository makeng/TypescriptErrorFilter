import React, { PropsWithChildren } from 'react'
import { Button, Popover } from '@arco-design/web-react'
import { message } from '../../Message'
import { IconCopy } from '@arco-design/web-react/icon'
import { head, last } from 'lodash-es'

interface Props {
  txt: string;
  show: boolean;
  onChangeShow(nextShow: boolean): void;
}

const FILE_REG = /[\w\/.-]+\.[j|t]sx?\(.+\)/
const toastSuccess = (msg: string) => message.success(msg)

const Toolbox: React.FC<PropsWithChildren<Props>> = (props) => {
  const { children, txt, show } = props

  function clickAnyBtn() {
    props.onChangeShow(false)
    return Promise.resolve()
  }

  const btnList = [
    {
      text: 'Path',
      icon: <IconCopy />,
      click: (text: string) => {
        const txtMathed = txt.match(FILE_REG)
        const path = head(txtMathed) || ''
        navigator.clipboard.writeText(path)
        toastSuccess(`${text} copied!`)
      },
    },
    {
      text: 'Error',
      icon: <IconCopy />,
      click: (text: string) => {
        const txtSplited = txt.split(FILE_REG)
        const err = last(txtSplited) || ''
        navigator.clipboard.writeText(err)
        toastSuccess(`${text} copied!`)
      },
    },
  ]

  return (
    <Popover
      popupVisible={show}
      onVisibleChange={props.onChangeShow}
      trigger="hover"
      position="tl"
      content={<>
        {btnList.map(({ text, icon, click }, index) => {
          const isNotLast = index !== btnList.length - 1
          return (
            <Button
              key={text} icon={icon} style={isNotLast ? { marginRight: '8px' } : undefined} size="small"
              onClick={() => clickAnyBtn().then(() => click(text))}>{text}</Button>
          )
        })}
      </>}
    >
      {children}
    </Popover>
  )
}

export default Toolbox
