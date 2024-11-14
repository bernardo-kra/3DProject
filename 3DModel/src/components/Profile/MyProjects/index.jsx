import React, { useEffect, useState } from 'react'
import { fetchProjects } from '../../../services/apiService'
import { Loading, Container, Text, Button } from '@common'
import Card from '@common/Card'
import ThreeDModal from '@components/ThreeDModal'
import './styles.css'

const MyProjects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedProject, setSelectedProject] = useState(null)

    const formatCloudfrontUrl = (folder, filename) => {
        const cloudfrontUrl = 'https://d39o5ylj4nzj6k.cloudfront.net/uploads/'
        const encodedFolder = encodeURIComponent(folder)
        const encodedFilename = encodeURIComponent(filename)
        return `${cloudfrontUrl}${encodedFolder}/${encodedFilename}`
    }

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projectsData = await fetchProjects()

                const formattedProjects = projectsData.projects.map(project => {
                    const folderName = `${project.projectName}-${project.user._id}`
                    return {
                        ...project,
                        coverImage: project.coverImage.map(imageUrl => {
                            const imageName = imageUrl.split('/').pop()
                            return formatCloudfrontUrl(folderName, imageName)
                        }),
                        filePath: formatCloudfrontUrl(folderName, project.fileName),
                    }
                })

                setProjects(formattedProjects || [])
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

    const modelUrl = 'src/assets/fantasyinteriorkit.glb'

    if (loading) return <Loading isLoading={true} />
    return (
        <Container className="MyProjects">
            <Text element="h1" size="large" className="MyProjects-title">Meus Projetos</Text>

            <Button text="Ver Modelo 3D" onClick={() => setSelectedProject({ filePath: modelUrl })} />

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
                            onView={() => handleView3D(project)}
                            onNavigate={() => navigate(`/project/${project.projectId}`)}
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
