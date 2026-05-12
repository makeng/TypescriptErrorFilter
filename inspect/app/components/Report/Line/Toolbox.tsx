import { PropsWithChildren } from 'react'
import { Button, Popover } from '@arco-design/web-react'
import { message } from '../../Message'
import { IconCopy } from '@arco-design/web-react/icon'

interface Props {
  txt: string;
  show: boolean;
  onChangeShow(nextShow: boolean): void;
}

const FILE_REG = /[\w/.-]+\.[jt]sx?\([\d,]+\)/
const toastSuccess = (msg: string) => message.success(msg)

const Toolbox: React.FC<PropsWithChildren<Props>> = ({ children, txt, show, onChangeShow }) => {
  const btnList = [
    {
      text: 'Path',
      icon: <IconCopy />,
      click: (text: string) => {
        const path = txt.match(FILE_REG)?.[0] ?? ''
        navigator.clipboard.writeText(path)
        toastSuccess(`${text} copied!`)
      },
    },
    {
      text: 'Error',
      icon: <IconCopy />,
      click: (text: string) => {
        const err = txt.split(FILE_REG).at(-1) ?? ''
        navigator.clipboard.writeText(err)
        toastSuccess(`${text} copied!`)
      },
    },
  ]

  return (
    <Popover
      popupVisible={show}
      onVisibleChange={onChangeShow}
      trigger="hover"
      position="tl"
      content={<>
        {btnList.map(({ text, icon, click }, index) => (
          <Button
            key={text} icon={icon}
            style={index < btnList.length - 1 ? { marginRight: '8px' } : undefined}
            size="small"
            onClick={() => { onChangeShow(false); click(text) }}
          >{text}</Button>
        ))}
      </>}
    >
      {children}
    </Popover>
  )
}

export default Toolbox
