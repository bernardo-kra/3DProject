import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './assets/theme/index.css'
import ModelViewer from './components/3DModelViewer'
import PageTest from './components/PageTest'
import AuthForm from '@components/AuthForm'
import UploadForm from '@components/UploadForm'
import Header from '@components/Home/Header'
import { useAuth } from './contexts/AuthContext'
import Home from '@components/Home/Home'
import { Loading } from '@common'

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loading isLoading={true} />

  return isAuthenticated ? element : <Navigate to="/login" replace />
}

const App = () => {
  const location = useLocation()
  const { loading } = useAuth()

  if (loading) return <Loading isLoading={true} />

  return (
    <div>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Header />}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/project/:id" element={<div>project</div>} />
        <Route path="/my-project/:id" element={<ProtectedRoute element={<div>my-project</div>} />} />
        <Route path="/my-projects" element={<ProtectedRoute element={<ModelViewer />} />} />
        <Route path="/create-project" element={<ProtectedRoute element={<UploadForm />} />} />
        <Route path="/register" element={<AuthForm />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/about" element={<div>about</div>} />
        <Route path="/contact" element={<div>contact</div>} />
        <Route path="/components" element={<PageTest />} />
      </Routes>
    </div>
  )
}

export default App
