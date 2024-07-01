import { Toaster } from '@/components/ui/toaster'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './components/Layout/Router.tsx'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
    <Toaster />
  </React.StrictMode>
)
