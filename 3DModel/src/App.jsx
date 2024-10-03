import React from 'react'
import { Routes, Route } from 'react-router-dom'

import "./index.css"
import ModelViewer from './components/3DModelViewer'


const App = () => {

  return (
    <Routes>
      <Route path="/" element={<div>home</div>} />
      <Route path="/project/:id" element={<div>project</div>} />
      <Route path="/my-project/:id" element={<div>my-project</div>} />
      <Route path="/my-projects" element={<ModelViewer/>} />
      <Route path='create-project' element={<div>create-project</div>} />
      <Route path="/register" element={<div>register</div>} />
      <Route path="/login" element={<div>login</div>} />
      <Route path="/about" element={<div>about</div>} />
      <Route path="/contact" element={<div>contact</div>} />
    </Routes>
  )
}
export default App