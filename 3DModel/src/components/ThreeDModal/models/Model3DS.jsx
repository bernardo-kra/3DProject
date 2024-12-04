import React from 'react'
import { useLoader } from '@react-three/fiber'
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader'

export default function Model3DS({ url }) {
    const model = useLoader(TDSLoader, url)
    return <primitive object={model} />
}
