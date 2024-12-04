import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function ModelGLTF({ url }) {
    const { scene } = useGLTF(url)

    scene.scale.set(1.5, 1.5, 1.5)
    scene.position.set(0, -0.5, 0)

    return <primitive object={scene} />
}
