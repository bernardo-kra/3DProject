import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ModelViewer from './components/ModelViewer'

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
