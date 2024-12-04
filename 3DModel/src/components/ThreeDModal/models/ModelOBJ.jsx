import React, { useEffect, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'

const ModelOBJ = ({ url }) => {
    const obj = useLoader(OBJLoader, url)
    const modelRef = useRef()

    useEffect(() => {
        if (obj) {
            obj.traverse((child) => {
                if (child.isMesh && !child.material) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x808080,
                        metalness: 0.5,
                        roughness: 0.5
                    })
                }
            })
            if (modelRef.current) {
                modelRef.current.add(obj)
            }
        }
    }, [obj])

    return <primitive object={obj} ref={modelRef} />
}

export default ModelOBJ
