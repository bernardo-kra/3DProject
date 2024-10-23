import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './assets/theme/index.css';
import ModelViewer from './components/3DModelViewer'
import PageTest from './components/PageTest';
import AuthForm from '@common/AuthForm';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/project/:id" element={<div>project</div>} />
        <Route path="/my-project/:id" element={<div>my-project</div>} />
        <Route path="/my-projects" element={<ModelViewer />} />
        <Route path='create-project' element={<div>create-project</div>} />
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