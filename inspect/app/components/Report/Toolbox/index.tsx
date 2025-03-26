import React, { PropsWithChildren, useState } from 'react';
import { Popover, Button } from '@arco-design/web-react';
import { IconCopy } from '@arco-design/web-react/icon';
import { head, last } from 'lodash-es';

interface Props {
  txt: string;
}

const FILE_REG = /[\w\/.-]+\.[j|t]sx?\(.+\)/;

const Index: React.FC<PropsWithChildren<Props>> = (props) => {
  const { children, txt } = props;
  const [show, setShow] = useState(false);


  function clickAnyBtn(cb: () => void) {
    setShow(false);
    cb();
  }

  const btnList = [
    {
      text: 'Path',
      icon: <IconCopy />,
      click: () => {
        const txtMathed = txt.match(FILE_REG);
        const path = head(txtMathed) || '';
        navigator.clipboard.writeText(path);
      },
    },
    {
      text: 'Error',
      icon: <IconCopy />,
      click: () => {
        const txtSplited = txt.split(FILE_REG);
        const err = last(txtSplited) || '';
        navigator.clipboard.writeText(err);
      },
    },
  ];

  return (
    <Popover
      popupVisible={show}
      onVisibleChange={setShow}
      trigger='hover'
      position='tl'
      content={<>
        {btnList.map(({ text, icon, click }, index) => {
          const isNotLast = index !== btnList.length - 1;
          return (
            <Button
              key={text} icon={icon} style={isNotLast ? { marginRight: '8px' } : undefined} size='small'
              onClick={() => clickAnyBtn(click)}>{text}</Button>
          );
        })}
      </>}
    >
      {children}
    </Popover>
  );
};

export default Index;
