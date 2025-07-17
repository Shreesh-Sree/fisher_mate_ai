import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Import i18n setup
import './services/i18nService';

// Service Worker for PWA functionality
import { registerSW } from './services/serviceWorkerService';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline functionality
registerSW();

// Report web vitals
import('./utils/reportWebVitals').then(({ default: reportWebVitals }) => {
  reportWebVitals();
});
