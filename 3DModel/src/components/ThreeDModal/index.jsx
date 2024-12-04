import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import './styles.css'
import { FiMaximize, FiMinimize, FiEye, FiEyeOff } from 'react-icons/fi'

import {
    Model3DS,
    ModelDAE,
    ModelFBX,
    ModelGLB,
    ModelOBJ,
    ModelSTL,
    ModelGLTF,
} from './models'

const modelComponents = {
    '3ds': Model3DS,
    'dae': ModelDAE,
    'fbx': ModelFBX,
    'glb': ModelGLB,
    'gltf': ModelGLTF,
    'obj': ModelOBJ,
    'stl': ModelSTL,
}

const ThreeDModal = ({ isOpen, onClose, fileKey }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [controlsVisible, setControlsVisible] = useState(true)
    const canvasRef = useRef(null)
    const controlsRef = useRef(null)
    const [autoRotate, setAutoRotate] = useState(true)
    const [autoRotateSpeed, setAutoRotateSpeed] = useState(1)

    const ModelComponent = useMemo(() => {
        if (!fileKey) return null
        const extension = fileKey.split('.').pop().toLowerCase()
        return modelComponents[extension]
    }, [fileKey])

    useEffect(() => {
        const handleContextLost = (event) => {
            event.preventDefault()
            console.warn('Contexto WebGL perdido, tentando restaurar...')
        }

        const canvas = canvasRef.current
        if (canvas) {
            canvas.addEventListener('webglcontextlost', handleContextLost, false)
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('webglcontextlost', handleContextLost, false)
            }
        }
    }, [])

    if (!isOpen || !fileKey) return null

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleZoomIn = () => {
        if (controlsRef.current) {
            controlsRef.current.dollyIn(0.9)
        }
    }

    const handleZoomOut = () => {
        if (controlsRef.current) {
            controlsRef.current.dollyOut(0.9)
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
                <button className="close-button" onClick={onClose}>
                    ✕
                </button>
                <button
                    className="expand-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <FiMinimize /> : <FiMaximize />}
                </button>
                <button
                    className="toggle-controls-button"
                    onClick={() => setControlsVisible(!controlsVisible)}
                >
                    {controlsVisible ? <FiEyeOff /> : <FiEye />}
                </button>
                <Canvas
                    ref={canvasRef}
                    className="model-canvas"
                    gl={{ antialias: true, alpha: false }}
                    camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }}
                >
                    <color attach="background" args={['#f0f0f0']} />
                    <ambientLight intensity={0.5} />
                    <directionalLight intensity={1} position={[5, 5, 5]} />
                    <Suspense
                        fallback={
                            <Html>
                                <div style={{ color: 'white' }}>Carregando modelo...</div>
                            </Html>
                        }
                    >
                        {ModelComponent ? (
                            <ModelComponent url={fileKey} />
                        ) : (
                            <Html>
                                <div style={{ color: 'red' }}>
                                    Formato não suportado: {fileKey.split('.').pop()}
                                </div>
                            </Html>
                        )}
                    </Suspense>
                    <OrbitControls
                        ref={controlsRef}
                        enableZoom={true}
                        minDistance={1}
                        maxDistance={50}
                        enableDamping={true}
                        dampingFactor={0.1}
                        autoRotate={autoRotate}
                        autoRotateSpeed={autoRotateSpeed}
                        makeDefault
                    />
                    <Environment preset="studio" />
                </Canvas>
                {controlsVisible && (
                    <div className="controls">
                        <button onClick={() => setAutoRotate(!autoRotate)}>
                            {autoRotate ? 'Desativar Rotação' : 'Ativar Rotação'}
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
                )}
            </div>
        </div>
    )
}

export default ThreeDModal
