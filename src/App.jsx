import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './auth/AuthContext'
import './App.css'
import React from 'react'

function App() {

    return (
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />  
          </AuthProvider>
        </BrowserRouter>
    )
}

export default App
