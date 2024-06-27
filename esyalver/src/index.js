import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// 'root' değişkeninin tanımlanması
const root = document.getElementById('root');

// ReactDOM.render veya ReactDOM.createRoot çağrısı
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  root
);
