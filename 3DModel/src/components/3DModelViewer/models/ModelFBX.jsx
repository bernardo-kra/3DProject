import React from 'react'
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export default function ModelFBX({ url }) {
    const fbx = useLoader(FBXLoader, url)
    
    // Ajuste a escala do modelo FBX para que seja visualizado corretamente
    fbx.scale.set(0.01, 0.01, 0.01) // Ajuste conforme necessário; 0.01 é um exemplo

    return <primitive object={fbx} />
}
