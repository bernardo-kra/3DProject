import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './assets/theme/index.css'
import ModelViewer from './components/3DModelViewer'
import PageTest from './components/PageTest'
import AuthForm from '@components/AuthForm'
import UploadForm from '@components/UploadForm'
import Header from '@components/Home/Header'

const App = () => {
  const location = useLocation()
  return (
    <div>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Header />}
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/project/:id" element={<div>project</div>} />
        <Route path="/my-project/:id" element={<div>my-project</div>} />
        <Route path="/my-projects" element={<ModelViewer />} />
        <Route path='create-project' element={<UploadForm />} />
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