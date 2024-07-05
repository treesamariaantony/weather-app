import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TemperatureProvider } from './TemperatureContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TemperatureProvider>
      <App />
    </TemperatureProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

