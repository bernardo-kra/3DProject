import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { fetchUploads, fetchSignedUrl } from '../../services/apiService'
import ModelGLB from './models/ModelGLB'
import ModelOBJ from './models/ModelOBJ'
import ModelSTL from './models/ModelSTL'
import ModelFBX from './models/ModelFBX'
import ModelDAE from './models/ModelDAE'
import Model3DS from './models/Model3DS'
import { Text, Button } from '@common'
import './styles.css'

function ModelViewer() {
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedModel, setSelectedModel] = useState(null)

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const uploadsData = await fetchUploads()
                setModels(uploadsData.files)
            } catch (error) {
                console.error('Erro ao carregar arquivos do S3:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchModels()
    }, [])

    const handleModelClick = async (file) => {
        try {
            const signedUrl = await fetchSignedUrl(file.key)
            setSelectedModel({ file, modelUrl: signedUrl })
        } catch (error) {
            console.error('Erro ao obter URL assinada:', error)
        }
    }

    const closeModal = () => {
        setSelectedModel(null)
    }

    const renderModel = (modelUrl) => {
        const cleanPath = modelUrl.split('?')[0]
        const extension = cleanPath.split('.').pop().toLowerCase()

        switch (extension) {
            case 'glb':
                return <ModelGLB url={modelUrl} />
            case 'obj':
                return <ModelOBJ url={modelUrl} />
            case 'stl':
                return <ModelSTL url={modelUrl} />
            case 'fbx':
                return <ModelFBX url={modelUrl} />
            case 'dae':
                return <ModelDAE url={modelUrl} />
            case '3ds':
                return <Model3DS url={modelUrl} />
            default:
                console.error('Formato de modelo não suportado:', extension)
                return null
        }
    }

    if (loading) {
        return <div>Carregando modelos...</div>
    }

    return (
        <div className="model-viewer-container">
            <div className="file-list">
                <Text element="h2" size="large">Arquivos Disponíveis</Text>
                {models.map((file) => (
                    <div
                        key={file.key}
                        onClick={() => handleModelClick(file)}
                        className="file-item"
                    >
                        <Text element="h3" size="medium">{file.key}</Text>
                        <Text element="p" size="small">{file.size} bytes</Text>
                        <Button text="Visualizar 3D" onClick={() => handleModelClick(file)} />
                    </div>
                ))}
            </div>

            {selectedModel && (
                <div className="model-modal-overlay" onClick={closeModal}>
                    <div className="model-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>×</button>

                        <Canvas className="model-canvas">
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 5, 5]} />
                            <OrbitControls />
                            {renderModel(selectedModel.modelUrl)}
                        </Canvas>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ModelViewer
