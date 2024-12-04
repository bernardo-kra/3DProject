import React, { useEffect, useState } from 'react'
import { fetchProjects } from '../../../services/apiService'
import { Text, Button, Loading } from '@common'
import ThreeDModal from '@components/ThreeDModal'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import './styles.css'

const cacheFile = async (url) => {
    const cacheName = '3d-model-cache'
    const cache = await caches.open(cacheName)

    const cachedResponse = await cache.match(url)
    if (cachedResponse) {
        return cachedResponse.url
    }

    const response = await fetch(url)
    if (response.ok) {
        await cache.put(url, response.clone())
        return response.url
    } else {
        throw new Error('Falha ao buscar o arquivo')
    }
}

const ProjectCarousel = () => {
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const projectsData = await fetchProjects()
                setProjects(projectsData.projects || [])
            } catch (error) {
                console.error('Erro ao carregar projetos:', error)
            }
        }

        loadProjects()
    }, [])

    const handleOpen3D = async (project) => {
        if (loading) return
        setLoading(true)
        setDisabled(true)

        try {
            const cachedFilePath = await cacheFile(project.filePath)
            setSelectedProject({ ...project, cachedFilePath })
        } catch (error) {
            console.error('Erro ao carregar o arquivo 3D:', error)
        } finally {
            setLoading(false)
            setDisabled(false)
        }
    }

    const handleClose3D = () => {
        setSelectedProject(null)
    }

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            partialVisibilityGutter: 40,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            partialVisibilityGutter: 30,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            partialVisibilityGutter: 20,
        },
    }

    if (!projects.length) {
        return <Text element="p">Nenhum projeto encontrado</Text>
    }

    return (
        <div className="carousel-container">
            {loading && <Loading isLoading={true} />}
            <div className="carousel-header">
                <Text element="h2" className="carousel-title-header">
                    Explore Nossos Projetos em Destaque
                </Text>
                <Text element="p" className="carousel-subtitle-header">
                    Descubra designs que transformam ideias em realidade
                </Text>
            </div>
            <Carousel
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={4000}
                infinite={true}
                containerClass="carousel-wrapper"
                itemClass="carousel-item"
                dotListClass="carousel-dots"
                showDots={true}
                partialVisible
            >
                {projects.map((project) => (
                    <div key={project.projectId} className="carousel-card">
                        <div className="carousel-image-wrapper">
                            <img
                                src={project.coverImage[0]}
                                alt={project.projectName}
                                className="carousel-image"
                            />
                        </div>
                        <div className="carousel-card-content">
                            <Text element="h3" className="carousel-card-title">
                                {project.projectName}
                            </Text>
                            <Text element="p" className="carousel-card-description">
                                {project.description.substring(0, 70)}...
                            </Text>
                            <Button
                                text="Ver em 3D"
                                onClick={() => handleOpen3D(project)}
                                className="carousel-card-button"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                ))}
            </Carousel>
            {selectedProject && (
                <ThreeDModal
                    isOpen={!!selectedProject}
                    onClose={handleClose3D}
                    fileKey={selectedProject.cachedFilePath}
                />
            )}
        </div>
    )
}

export default ProjectCarousel
