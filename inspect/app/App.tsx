import React from 'react';
import errorLog from '../dist/error-log.json';

function App() {
  return (
    <div className='App'>
      {JSON.stringify(errorLog)}
    </div>
  );
}

export default App;
