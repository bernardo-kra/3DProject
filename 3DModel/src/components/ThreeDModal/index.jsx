import React, { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls, Environment } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import './styles.css'
import { FiMaximize, FiMinimize } from 'react-icons/fi'

const ModelViewer = ({ url, extension }) => {
    let Loader
    switch (extension) {
        case 'glb':
        case 'gltf':
            Loader = GLTFLoader
            break
        case 'obj':
            Loader = OBJLoader
            break
        case 'stl':
            Loader = STLLoader
            break
        case 'fbx':
            Loader = FBXLoader
            break
        default:
            console.error(`Extensão de arquivo não suportada: ${extension}`)
            return null
    }

    const model = useLoader(Loader, url)

    if (!model) return <p>Erro ao carregar o modelo.</p>

    let modelObject
    if (extension === 'glb' || extension === 'gltf') {
        modelObject = model.scene.clone()
    } else if (extension === 'stl') {
        const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
        modelObject = new THREE.Mesh(model, material)
    } else {
        modelObject = model.clone()
    }

    return (
        <primitive
            object={modelObject}
            position={[0, -0.5, 0]}
            scale={[1.5, 1.5, 1.5]}
        />
    )
}

const ThreeDModal = ({ isOpen, onClose, fileKey }) => {
    const canvasRef = useRef(null)
    const controlsRef = useRef(null)
    const [autoRotate, setAutoRotate] = useState(true)
    const [autoRotateSpeed, setAutoRotateSpeed] = useState(1)
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        const handleContextLost = (event) => {
            event.preventDefault()
            console.log("WebGL Context Perdido, reiniciando...")
        }

        if (canvasRef.current) {
            const canvas = canvasRef.current
            canvas.addEventListener('webglcontextlost', handleContextLost, false)
        }

        return () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current
                canvas.removeEventListener('webglcontextlost', handleContextLost, false)
            }
        }
    }, [])

    if (!isOpen || !fileKey) return null

    const isSketchfabUrl = fileKey.includes('sketchfab.com')
    const extension = fileKey.split('.').pop().toLowerCase()

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleZoomIn = () => {
        if (controlsRef.current) {
            controlsRef.current.zoom0 = Math.max(controlsRef.current.object.zoom - 0.5, 1)
            controlsRef.current.object.updateProjectionMatrix()
        }
    }

    const handleZoomOut = () => {
        if (controlsRef.current) {
            controlsRef.current.zoom0 = Math.min(controlsRef.current.object.zoom + 0.5, 10)
            controlsRef.current.object.updateProjectionMatrix()
        }
    }

    const handleResetView = () => {
        if (controlsRef.current) {
            controlsRef.current.reset()
        }
        setAutoRotate(true)
        setAutoRotateSpeed(1)
    }

    return (
        <div className="model-overlay" onClick={handleOverlayClick}>
            <div className={`model-content ${isExpanded ? 'expanded' : ''}`}>
                <button className="close-button" onClick={onClose}>✕</button>
                <button 
                    className="expand-button" 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <FiMinimize /> : <FiMaximize />}
                </button>

                <div className="control-buttons">
                    <button onClick={() => setAutoRotate(!autoRotate)}>
                        {autoRotate ? "Desativar Rotação" : "Ativar Rotação"}
                    </button>
                    <button onClick={handleZoomIn}>Zoom In</button>
                    <button onClick={handleZoomOut}>Zoom Out</button>
                    <button onClick={handleResetView}>Resetar Visão</button>
                    <label>
                        Velocidade de Rotação:
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            value={autoRotateSpeed}
                            onChange={(e) => setAutoRotateSpeed(parseFloat(e.target.value))}
                        />
                    </label>
                </div>

                {isSketchfabUrl ? (
                    <iframe
                        title="3D Model Viewer"
                        src={`${fileKey}?autospin=1&autostart=1&ui_infos=0&ui_stop=0&ui_controls=1&ui_snapshots=1&ui_watermark=0`}
                        className="model-iframe"
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <Canvas
                        ref={canvasRef}
                        className="model-canvas"
                    >
                        <ambientLight intensity={0.5} />
                        <directionalLight  intensity={1} />
                        <Suspense fallback={null}>
                            <ModelViewer url={fileKey} extension={extension} />
                        </Suspense>
                        <OrbitControls
                            ref={controlsRef}
                            enableZoom={true}
                            minDistance={1}
                            maxDistance={10}
                            autoRotate={autoRotate}
                            autoRotateSpeed={autoRotateSpeed}
                        />
                        <Environment preset="studio" />
                    </Canvas>
                )}
            </div>
        </div>
    )
}

export default ThreeDModal
