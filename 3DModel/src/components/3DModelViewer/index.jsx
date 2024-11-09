import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import axios from 'axios';
import { SITE_URL } from '@variables/index';

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

export default function ModelViewer() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await axios.get(`${SITE_URL}/projects`);
                console.log("*response", response.data)
                setModels(response.data);
            } catch (error) {
                console.error('Erro ao buscar os modelos 3D:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchModels();
    }, []);

    const handleModelClick = (model) => {
        setSelectedModel(model);
    };

    if (loading) {
        return <div>Carregando modelos...</div>;
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '300px', padding: '10px' }}>
                {models.map((model) => (
                    <div
                        key={model._id}
                        onClick={() => handleModelClick(model)}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '10px',
                            marginBottom: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        <h3>{model.projectName}</h3>
                        <img src={`${SITE_URL}/${model.coverImage}`} alt={model.projectName} style={{ width: '100%', borderRadius: '5px' }} />
                    </div>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                <Canvas style={{ width: '100vw', height: '100vh' }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} />
                    <OrbitControls />
                    {selectedModel && (
                        <Model url={`${SITE_URL}/${selectedModel.filePath}`} />
                    )}
                </Canvas>
            </div>
        </div>
    );
}
