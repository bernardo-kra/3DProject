// ModelGLB.js
import React, { useState } from 'react'
import { useGLTF } from '@react-three/drei'

export default function ModelGLB({ url }) {
    const [error, setError] = useState(false)
    const { scene } = useGLTF(url, undefined, (error) => {
        console.error('Error loading GLB:', error)
        setError(true)
    })

    if (error) return <div>Error loading model</div>

    // Configurar a escala e a posição central do modelo
    scene.scale.set(1.5, 1.5, 1.5) // Ajuste a escala conforme necessário
    scene.position.set(0, -0.5, 0) // Ajuste a posição para centralizar o modelo

    return <primitive object={scene} />
}
