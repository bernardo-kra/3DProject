import React from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function ModelGLB({ url }) {
    const { scene } = useGLTF(url)

    scene.traverse((child) => {
        if (child.isMesh && child.material.map) {
            child.material.map.encoding = THREE.sRGBEncoding
        }
    })

    scene.scale.set(1.5, 1.5, 1.5)
    scene.position.set(0, -0.5, 0)

    return <primitive object={scene} />
}
