import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { LicenseProvider } from './pages/LicenseContext';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LicenseProvider>

    <App />
    </LicenseProvider>
  </React.StrictMode>,
)
