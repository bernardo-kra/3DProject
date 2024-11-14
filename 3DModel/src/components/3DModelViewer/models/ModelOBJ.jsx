import React, { useEffect, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

const ModelOBJ = ({ url }) => {
    const obj = useLoader(OBJLoader, url)
    const modelRef = useRef()

    useEffect(() => {
        if (obj && modelRef.current) {
            modelRef.current.add(obj)
        }
    }, [obj])

    return <primitive object={obj} ref={modelRef} />
}

export default ModelOBJ
