import React from 'react'
import { motion } from 'framer-motion'
import { Container, Text } from '@common'
import './styles.css'

const WorksSection = ({ projects }) => {
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }
    }

    return (
        <Container className="works-section">
            <Text element="h2" className="works-title">Trabalhos Realizados</Text>
            <div className="works-grid">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        className="work-card"
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="work-image-wrapper">
                            <img src={project.src} alt={project.title} className="work-image" />
                        </div>
                        <div className="work-info">
                            <Text element="h3" className="work-title">{project.title}</Text>
                            <Text element="p" className="work-description">{project.description}</Text>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Container>
    )
}

export default WorksSection
