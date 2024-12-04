import React, { useEffect, useState, useContext } from 'react'
import { fetchProjects } from '../../../services/apiService'
import { Loading, Container, Text, Button } from '@common'
import Card from '@common/Card'
import ThreeDModal from '@components/ThreeDModal'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '@context/AuthContext'
import { PROJECT_URL } from '@variables'
import './styles.css'

const MyProjects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedProject, setSelectedProject] = useState(null)
    const { isAdmin } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projectsData = await fetchProjects()
                setProjects(projectsData.projects || [])
            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadProjects()
    }, [])

    const handleView3D = (project) => setSelectedProject(project)

    const handleCloseViewer = () => setSelectedProject(null)

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
            try {
                const response = await fetch(`${PROJECT_URL}/${projectId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                })

                if (response.ok) {
                    setProjects(projects.filter(project => project.projectId !== projectId))
                    alert('Projeto excluído com sucesso.')
                } else {
                    const data = await response.json()
                    alert(data.mensagem || 'Erro ao excluir o projeto.')
                }
            } catch (error) {
                console.error('Erro ao excluir o projeto:', error)
                alert('Erro de conexão: não foi possível alcançar o servidor.')
            }
        }
    }

    const handleEditProject = (projectId) => {
        navigate(`/project/${projectId}`)
    }

    if (loading) return <Loading isLoading={true} />

    return (
        <Container className="MyProjects">
            <Text element="h1" size="large" className="MyProjects-title">Meus Projetos</Text>

            {projects.length === 0 ? (
                <Text element="p" size="base" className="MyProjects-empty">Você ainda não possui projetos.</Text>
            ) : (
                <div className="MyProjects-grid">
                    {projects.map(project => (
                        <Card
                            key={project.projectId}
                            imageUrl={project.coverImage && project.coverImage[0]}
                            title={project.projectName}
                            description={project.description}
                            onView3D={() => handleView3D(project)}
                            onViewProject={() => handleEditProject(project.projectId)}
                            onDelete={() => handleDeleteProject(project.projectId)}
                            projectId={project.projectId}
                        />
                    ))}
                </div>
            )}

            {selectedProject && (
                <ThreeDModal
                    isOpen={!!selectedProject}
                    onClose={handleCloseViewer}
                    fileKey={selectedProject.filePath}
                />
            )}
        </Container>
    )
}

export default MyProjects
