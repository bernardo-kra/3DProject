import React from 'react'
import { motion } from 'framer-motion'
import { Container, Text } from '@common'
import './styles.css'

const TeamSection = () => {
    const teamDetails = {
        story: `
            Nossa equipe é formada por profissionais apaixonados por arquitetura e design, trabalhando juntos para 
            transformar sonhos em realidade. Valorizamos a colaboração e acreditamos que as melhores ideias nascem 
            da troca de experiências entre nossa equipe e nossos clientes. Cada projeto é único e, por isso, dedicamos 
            atenção aos detalhes, garantindo que cada espaço reflita personalidade, inovação e funcionalidade. Estamos 
            aqui para criar não apenas ambientes, mas experiências memoráveis para você.
        `,
        images: [
            {
                id: 1,
                src: 'src/assets/images/workers/workers1.png',
                alt: 'Equipe colaborando no projeto'
            },
            {
                id: 2,
                src: 'src/assets/images/workers/workers2.jpg',
                alt: 'Time discutindo ideias para o design'
            }
        ]
    }

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.3 }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }
    }

    return (
        <motion.div
            className="team-section custom-container"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <Text element="h2" className="team-title">Nossa Equipe</Text>
            <Text element="p" className="team-story">{teamDetails.story}</Text>
            <div className="team-images">
                {teamDetails.images.map((image) => (
                    <motion.div
                        key={image.id}
                        className="team-image-card"
                        variants={cardVariants}
                    >
                        <img src={image.src} alt={image.alt} className="team-image" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default TeamSection
