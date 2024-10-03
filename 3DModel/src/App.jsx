import { useState } from 'react'
import './App.css'
import ModelViewer from './components/3DModelViewer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <ModelViewer></ModelViewer>
    </div>
    </>
  )
}

export default App
