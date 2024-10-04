import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

export default function ModelViewer() {
    return (
        <Canvas style={{ width: '100vw', height: '100vh' }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <OrbitControls />
            <Suspense fallback={<div>Loading 3D Model...</div>}>
                <Model url="/3dModels/teste1.glb" />
            </Suspense>
        </Canvas>
    );
}
