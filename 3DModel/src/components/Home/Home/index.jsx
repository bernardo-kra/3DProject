import React, { useContext, useState } from 'react'
import { ThemeContext } from '@context/ThemeContext'
import { useAuth } from '@context/AuthContext'
import { Button, Carousel, Text } from '@common'
import WorksSection from '../WorkSection'
import { projectCategories } from '../WorkSection/components/projectCategories'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
    FiPercent, FiHome, FiMap, FiCamera, FiBox
} from 'react-icons/fi'
import './styles.css'
import TeamSection from '../TeamSection/index.jsx'
import Footer from '../Footer'

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
                <div className="background-overlay">
                    <Text element="h1" className="home-title">
                        Bem-vindo ao Projeto de Arquitetura em 3D!
                    </Text>
                    <Text element="p" className="home-subtitle">
                        Experimente o mundo da arquitetura com visualizações interativas em 3D.
                    </Text>
                </div>
            </div>

            {isAuthenticated ? (
                <Carousel />
            ) : (
                <div className="not-authenticated">
                    <Text element="p">
                        Faça login para acessar seus projetos em 3D!
                    </Text>
                    <Button
                        text="Login"
                        onClick={() => window.location.href = '/login'}
                    />
                </div>
            )}

            <div className="theme-buttons">
                <Button
                    text="Light Mode"
                    className={`theme-button ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => changeTheme('light')}
                />
                <Button
                    text="Dark Mode"
                    className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => changeTheme('dark')}
                />
                <Button
                    text="Blue Mode"
                    className={`theme-button ${theme === 'blue' ? 'active' : ''}`}
                    onClick={() => changeTheme('blue')}
                />
            </div>

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
