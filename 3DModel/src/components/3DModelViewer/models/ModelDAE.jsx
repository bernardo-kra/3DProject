import React from 'react'
import { useLoader } from '@react-three/fiber'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'

export default function ModelDAE({ url }) {
    const { scene } = useLoader(ColladaLoader, url)
    return <primitive object={scene} />
}
