import React, { useContext, useState } from 'react'
import { ThemeContext } from '@context/ThemeContext'
import { useAuth } from '@context/AuthContext'
import { Button, Carousel, Text } from '@common'
import WorksSection from '../WorkSection'
import { projectCategories } from '../WorkSection/components/projectCategories'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiPercent, FiHome, FiMap, FiCamera, FiBox } from 'react-icons/fi'
import TeamSection from '../TeamSection/index.jsx'
import Footer from '../Footer'
import './styles.css'

const Home = () => {
    const { theme, changeTheme } = useContext(ThemeContext)
    const { isAuthenticated } = useAuth()
    const [currentProjects, setCurrentProjects] = useState(projectCategories['Residencial'] || [])
    const { scrollY } = useScroll()
    const parallaxY = useTransform(scrollY, [0, 300], ['0%', '10%'])

    const handleCategoryChange = (category) => {
        setCurrentProjects(projectCategories[category] || [])
    }

    return (
        <div className="home-container">
            <div className="background-section">
                <motion.div
                    className="background-image"
                    style={{
                        backgroundImage: "url('src/assets/images/home_image.jpeg')",
                        y: parallaxY
                    }}
                />
                <motion.div
                    className="background-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <Text element="h1" className="home-title">
                        Bem-vindo ao Projeto de Arquitetura em 3D!
                    </Text>
                    <Text element="p" className="home-subtitle">
                        Explore a criatividade com experiências interativas e visuais surpreendentes
                    </Text>
                    <Button
                        text="Saiba Mais"
                        className="cta-button"
                        onClick={() => document.querySelector('.icon-section').scrollIntoView({ behavior: 'smooth' })}
                    />
                </motion.div>
            </div>

            {isAuthenticated ? (
                <Carousel />
            ) : (
                <motion.div
                    className="not-authenticated"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Text element="p">Faça login para acessar seus projetos em 3D!</Text>
                    <Button
                        text="Login"
                        onClick={() => window.location.href = '/login'}
                        className="login-button"
                    />
                </motion.div>
            )}

            <motion.div
                className="icon-section"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                    backgroundImage: "url('src/assets/images/cards-works/card1.jpg')",
                    backgroundAttachment: 'fixed'
                }}
            >
                <Button
                    icon={<FiPercent />}
                    text="Promoções"
                    className="icon-button"
                    onClick={() => handleCategoryChange('Promoções')}
                />
                <Button
                    icon={<FiHome />}
                    text="Residencial"
                    className="icon-button"
                    onClick={() => handleCategoryChange('Residencial')}
                />
                <Button
                    icon={<FiMap />}
                    text="Urbanismo"
                    className="icon-button"
                    onClick={() => handleCategoryChange('Urbanismo')}
                />
                <Button
                    icon={<FiCamera />}
                    text="Fotografia"
                    className="icon-button"
                    onClick={() => handleCategoryChange('Fotografia')}
                />
                <Button
                    icon={<FiBox />}
                    text="Modelos 3D"
                    className="icon-button"
                    onClick={() => handleCategoryChange('Modelos 3D')}
                />
            </motion.div>

            <WorksSection projects={currentProjects} />

            <motion.div
                className="divider-section"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                    backgroundImage: "url('src/assets/images/cards-works/card2.jpeg')",
                    backgroundAttachment: 'fixed'
                }}
            >
                <Text element="h2" className="divider-title">
                    Descubra nossas Soluções
                </Text>
            </motion.div>

            <TeamSection />

            <Footer />
        </div>
    )
}

export default Home
