import React, { useEffect, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'

export default function ModelFBX({ url }) {
    const model = useLoader(FBXLoader, url)
    const modelRef = useRef()

    useEffect(() => {
        model.traverse((child) => {
            if (child.isMesh) {
                if (child.material && child.material.map) {
                    child.material.map.encoding = THREE.sRGBEncoding
                } else {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x808080,
                        metalness: 0.5,
                        roughness: 0.5,
                    })
                }
            }
        })

        const box = new THREE.Box3().setFromObject(model)
        const size = new THREE.Vector3()
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z)
        const desiredSize = 2
        const scale = desiredSize / maxDim
        model.scale.set(scale, scale, scale)

        box.setFromObject(model)
        const center = new THREE.Vector3()
        box.getCenter(center)
        model.position.x += (model.position.x - center.x)
        model.position.y += (model.position.y - center.y)
        model.position.z += (model.position.z - center.z)
    }, [model])

    return <primitive ref={modelRef} object={model} />
}
