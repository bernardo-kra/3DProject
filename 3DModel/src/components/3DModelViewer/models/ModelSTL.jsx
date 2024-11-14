import React from 'react'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

export default function ModelSTL({ url }) {
    const geometry = useLoader(STLLoader, url)
    return <mesh geometry={geometry} />
}
