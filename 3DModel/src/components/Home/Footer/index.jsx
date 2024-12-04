import React from 'react'
import { Text } from '@common'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaPinterest } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './styles.css'

const Footer = () => {
    return (
        <footer className="footer-container">
            <motion.div
                className="footer-columns"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="footer-column">
                    <Text element="h3" className="footer-title">Serviços</Text>
                    <ul>
                        <li><a href="#">Projetos de Interiores</a></li>
                        <li><a href="#">Consultoria Arquitetônica</a></li>
                        <li><a href="#">Modelagem 3D</a></li>
                        <li><a href="#">Urbanismo</a></li>
                        <li><a href="#">Design Personalizado</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <Text element="h3" className="footer-title">Informações</Text>
                    <ul>
                        <li><a href="#">Sobre a Empresa</a></li>
                        <li><a href="#">Nossa Equipe</a></li>
                        <li><a href="#">Termos e Condições</a></li>
                        <li><a href="#">Política de Privacidade</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <Text element="h3" className="footer-title">Redes Sociais</Text>
                    <div className="footer-social-icons">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaYoutube /></a>
                        <a href="#"><FaLinkedin /></a>
                        <a href="#"><FaPinterest /></a>
                    </div>
                </div>
            </motion.div>
            <motion.div
                className="footer-bottom"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <Text element="p" className="footer-copyright">
                    &copy; {new Date().getFullYear()} BK Architecture. Todos os direitos reservados.
                </Text>
            </motion.div>
        </footer>
    )
}

export default Footer
