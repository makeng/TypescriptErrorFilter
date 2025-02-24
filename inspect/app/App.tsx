import React, { useState } from 'react';
// ui
import Chart from './components/Chart';
import Report from './components/Report';
// fn
import { Color } from '../utils';
import { entries } from 'lodash-es';
import errorReportJson from '../dist/error-log.json';

export type DataItem = {
  name: string;
  value: number;
  color: Color;
  lines: string[];
}

function App() {
  const [color, setColor] = useState<Color>(Color.Red);
  const data = entries(errorReportJson)
    .reverse()
    .map(([key, value]) => {
      const color = key as Color;
      return ({
        name: key,
        value: value.length,
        color,
        lines: value,
      }) satisfies DataItem;
    });
  console.log(data);
  return (
    <div className='app'>
      <Chart list={data} onMouseEnterSection={({ color }) => setColor(color)} />
      <Report color={color} list={data} />
    </div>
  );
}

export default App;
