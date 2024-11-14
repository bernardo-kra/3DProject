import React, { useState, useContext, useEffect } from 'react'
import { ThemeContext } from '@context/ThemeContext'
import { AuthContext } from '@context/AuthContext'
import { Button, Input, Container, Text, Loading, Modal as CommonModal } from '@common'
import { useNavigate } from 'react-router-dom'
import { FiUpload, FiImage, FiX } from 'react-icons/fi'
import { UPLOAD_URL } from "@variables"
import './styles.css'
import Header from '@components/Home/Header'

const UploadForm = () => {
    const { changeTheme } = useContext(ThemeContext)
    const { isAuthenticated } = useContext(AuthContext)
    const [projectName, setProjectName] = useState('')
    const [representativeName, setRepresentativeName] = useState('')
    const [description, setDescription] = useState('')
    const [coverImage, setCoverImage] = useState(null)
    const [coverImagePreview, setCoverImagePreview] = useState('')
    const [projectDate, setProjectDate] = useState('')
    const [file3D, setFile3D] = useState(null)
    const [file3DName, setFile3DName] = useState('')
    const [visibility, setVisibility] = useState('archived')
    const [loading, setLoading] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalDescription, setModalDescription] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            // navigate('/login') // TODO
        }
    }, [isAuthenticated, navigate])

    const openModal = (title, description) => {
        setModalTitle(title)
        setModalDescription(description)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleUpload = async () => {
        const newErrors = {}
        if (!projectName) newErrors.projectName = 'Campo obrigatório*'
        if (!representativeName) newErrors.representativeName = 'Campo obrigatório*'
        if (!coverImage) newErrors.coverImage = 'Campo obrigatório*'
        if (!projectDate) newErrors.projectDate = 'Campo obrigatório*'
        if (!file3D) newErrors.file3D = 'Campo obrigatório*'

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        setLoading(true)

        const formData = new FormData()
        formData.append('projectName', projectName)
        formData.append('representativeName', representativeName)
        formData.append('description', description)
        formData.append('coverImage', coverImage)
        formData.append('projectDate', projectDate)
        formData.append('file3D', file3D)
        formData.append('status', visibility)

        try {
            const response = await fetch(UPLOAD_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            })

            if (!response.ok) {
                const data = await response.json()
                openModal('Erro', data.mensagem || 'Erro ao enviar o projeto.')
            } else {
                const data = await response.json()
                openModal('Sucesso', 'Projeto enviado com sucesso!')
                setProjectName('')
                setRepresentativeName('')
                setDescription('')
                setCoverImage(null)
                setCoverImagePreview('')
                setProjectDate('')
                setFile3D(null)
                setFile3DName('')
                setVisibility('archived')
            }
        } catch (error) {
            openModal('Erro', 'Erro de conexão: não foi possível alcançar o servidor.')
            console.error('Erro na conexão:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (setter, fieldName) => (e) => {
        setter(e.target.value)
        if (errors[fieldName]) {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: undefined }))
        }
    }

    const handleCoverImageChange = (e) => {
        if (loading) return
        const file = e.target.files[0]
        setCoverImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setCoverImagePreview(reader.result)
        }
        if (file) {
            reader.readAsDataURL(file)
        } else {
            setCoverImagePreview(null)
        }
    }

    const handleFile3DChange = (e) => {
        if (loading) return
        const file = e.target.files[0]
        setFile3D(file)
        setFile3DName(file ? file.name : '')
    }

    const openImageModal = () => {
        if (loading) return
        setIsImageModalOpen(true)
    }

    const closeImageModal = () => {
        setIsImageModalOpen(false)
    }

    const removeCoverImage = (event) => {
        if (loading) return
        event.stopPropagation()
        setCoverImage(null)
        setCoverImagePreview('')
    }

    const removeFile3D = (event) => {
        if (loading) return
        event.stopPropagation()
        setFile3D(null)
        setFile3DName('')
    }

    return (
        <div className="UploadForm">
            <Container size="large" className="UploadForm-container" alignItems="center">
                {loading && <Loading isLoading={loading} />}
                <CommonModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalTitle}
                >
                    <Text element="p" size="medium">{modalDescription}</Text>
                    <Button text="Fechar" onClick={closeModal} />
                </CommonModal>

                <CommonModal
                    isOpen={isImageModalOpen}
                    onClose={closeImageModal}
                    title="Prévia da Imagem"
                >
                    {coverImagePreview && (
                        <img
                            src={coverImagePreview}
                            alt="Prévia da Imagem"
                            className="UploadForm-imageModalPreview"
                        />
                    )}
                </CommonModal>

                <div className="UploadForm-content">
                    <div className="UploadForm-left">
                        <div className="UploadForm-inputGroup">
                            <Text className="UploadForm-label" element="label" size="small">Nome do Projeto <span className="required">*</span></Text>
                            <Input
                                type="text"
                                placeholder="Nome do Projeto"
                                value={projectName}
                                onChange={handleInputChange(setProjectName, 'projectName')}
                                disabled={loading}
                            />
                            {errors.projectName && <Text className="UploadForm-error" size="small">{errors.projectName}</Text>}
                        </div>

                        <div className="UploadForm-inputGroup">
                            <Text className="UploadForm-label" element="label" size="small">Nome do Representante <span className="required">*</span></Text>
                            <Input
                                type="text"
                                placeholder="Nome do Representante"
                                value={representativeName}
                                onChange={handleInputChange(setRepresentativeName, 'representativeName')}
                                disabled={loading}
                            />
                            {errors.representativeName && <Text className="UploadForm-error" size="small">{errors.representativeName}</Text>}
                        </div>

                        <div className="UploadForm-inputGroup">
                            <Text className="UploadForm-label" element="label" size="small">Descrição</Text>
                            <Input
                                type="text"
                                placeholder="Descrição do Projeto"
                                value={description}
                                onChange={handleInputChange(setDescription, 'description')}
                                disabled={loading}
                            />
                        </div>

                        <div className="UploadForm-inputGroup">
                            <Text className="UploadForm-label" element="label" size="small">Visibilidade do Projeto</Text>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="UploadForm-select"
                                disabled={loading}
                            >
                                <option value="archived">Privado</option>
                                <option value="active">Público</option>
                            </select>
                        </div>

                        <div className="UploadForm-inputGroup">
                            <Text className="UploadForm-label" element="label" size="small">Imagem de Capa <span className="required">*</span></Text>
                            <div
                                className={`UploadForm-fileDrop ${loading ? 'disabled' : ''}`}
                                onClick={() => !loading && document.getElementById('cover-image-upload').click()}
                            >
                                <FiImage size={24} className="UploadForm-imageIcon" />
                                <Input
                                    type="file"
                                    id="cover-image-upload"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    className="UploadForm-fileInput"
                                    style={{ display: 'none' }}
                                    disabled={loading}
                                />
                                {coverImagePreview && (
                                    <div className="UploadForm-previewContainer">
                                        <img
                                            src={coverImagePreview}
                                            alt="Prévia da Imagem"
                                            className="UploadForm-imagePreview"
                                            onClick={openImageModal}
                                        />
                                        <button className="UploadForm-removeButton" onClick={removeCoverImage} disabled={loading}>
                                            <FiX size={20} />
                                        </button>
                                    </div>
                                )}
                                <Text className="UploadForm-imageDescription">Arraste e solte arquivos aqui ou clique para selecionar. Suporta arquivos JPG, PNG, etc.</Text>
                            </div>
                            {errors.coverImage && <Text className="UploadForm-error" size="small">{errors.coverImage}</Text>}
                        </div>

                        <div className="UploadForm-inputGroup">
                            <Text className="UploadForm-label" element="label" size="small">Data do Projeto <span className="required">*</span></Text>
                            <Input
                                type="date"
                                value={projectDate}
                                onChange={handleInputChange(setProjectDate, 'projectDate')}
                                disabled={loading}
                            />
                            {errors.projectDate && <Text className="UploadForm-error" size="small">{errors.projectDate}</Text>}
                        </div>
                    </div>

                    <div className="UploadForm-right">
                        <div className="UploadForm-inputGroup">
                            <Text className="UploadForm-label" element="label" size="small">Arquivo 3D <span className="required">*</span></Text>
                            <div
                                className={`UploadForm-fileDrop ${loading ? 'disabled' : ''}`}
                                onClick={() => !loading && document.getElementById('file-3D-upload').click()}
                            >
                                <FiUpload size={24} className="UploadForm-fileIcon" />
                                <Input
                                    type="file"
                                    id="file-3D-upload"
                                    accept=".glb, .gltf, .fbx, .3ds, .dae, .obj, .stl"
                                    onChange={handleFile3DChange}
                                    className="UploadForm-fileInput"
                                    style={{ display: 'none' }}
                                    disabled={loading}
                                />
                                {file3DName && (
                                    <div className="UploadForm-filePreviewContainer">
                                        <Text className="UploadForm-filePreviewName">{file3DName}</Text>
                                        <button className="UploadForm-removeButton" onClick={removeFile3D} disabled={loading}>
                                            <FiX size={20} />
                                        </button>
                                    </div>
                                )}
                                <Text className="UploadForm-fileDescription">Arraste e solte arquivos aqui ou clique para selecionar. Suporta arquivos glb, .gltf, .fbx, 3ds, dae, obj, stl.</Text>
                            </div>
                            {errors.file3D && <Text className="UploadForm-error" size="small">{errors.file3D}</Text>}
                        </div>
                    </div>
                </div>

                <Button text="Fazer upload do projeto" onClick={handleUpload} disabled={loading} />
            </Container>
        </div>
    )
}

export default UploadForm
