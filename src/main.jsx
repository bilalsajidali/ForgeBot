import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthHydration from './components/AuthHydration.jsx'
import { env } from './config/env.js'

document.title = env.appName

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthHydration>
        <App />
      </AuthHydration>
    </BrowserRouter>
  </StrictMode>,
)
