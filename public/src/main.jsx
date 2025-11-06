import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/globals.css'

function ThemeWrapper() {
  useEffect(() => {
    // Aplicar la clase del tema al elemento html
    const theme = localStorage.getItem('theme') || 'light'
    document.documentElement.className = theme
  }, [])

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeWrapper />
  </StrictMode>,
)