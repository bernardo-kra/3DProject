import React, { useState } from 'react'
import { upload } from './apiService'

const FileUploadWithProgress = () => {
    const [progress, setProgress] = useState(0)
    const [uploading, setUploading] = useState(false)

    const handleFileChange = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setUploading(true)
        setProgress(0)

        try {
            await upload(file, (progressEvent) => {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setProgress(percentage)
            })
        } catch (error) {
            console.error('Erro ao fazer upload:', error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
            />
            {uploading && (
                <div style={{ marginTop: '20px' }}>
                    <div style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '5px', overflow: 'hidden' }}>
                        <div
                            style={{
                                height: '10px',
                                width: `${progress}%`,
                                backgroundColor: '#4caf50',
                                transition: 'width 0.5s ease',
                            }}
                        ></div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>{progress}%</div>
                </div>
            )}
        </div>
    )
}

export default FileUploadWithProgress
