import { FC } from 'react';
import './index.scss';
import { Color } from '../../../utils';
import Block from '../Block';
import { DataItem } from '../../App';
import { createBEM } from '../utils';

interface Props {
  color: Color;
  list: DataItem[];
}

const bem = createBEM('report');

const Index: FC<Props> = (props) => {
  const { list } = props;
  return (
    <Block className={bem()} title='Report'>
      {list.map(({ color, lines }) => {
        return (
          <div key={color}>
            <span><i className={bem('dot')} style={{ backgroundColor: color }} />{color}</span>
            <ul>
              {lines.map(txt => <li>{txt}</li>)}
            </ul>
          </div>
        );
      })}
    </Block>
  );
};
export default Index;
