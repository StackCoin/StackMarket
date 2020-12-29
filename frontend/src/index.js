import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

window.__env__ = Object.fromEntries(
  Object.entries({
    ...window.__env__,
  }).filter(([_, value]) => value !== '<no value>')
);

if (process.env.NODE_ENV === 'development') {
  window.__env__ = {
    ...window.__env__,
    ...process.env,
  };
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
