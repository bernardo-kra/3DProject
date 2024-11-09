import React, { useState, useContext } from 'react'
import { useAuth } from '@context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Container, Text, Button } from '@common'
import './styles.css'

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const toggleMenu = () => {
        setMenuOpen(prev => !prev)
    }

    return (
        <div className="Header">
            {isAuthenticated ? (
                <div className="Header-userInfo" onClick={toggleMenu}>
                    <img src={user?.profileImage || '/default-avatar.png'} alt="User Avatar" className="Header-avatar" />
                    <Text size="small" element='p' className="Header-username">{user?.name}</Text>
                    {menuOpen && (
                        <div className="Header-menu">
                            <Button text="Meu Perfil" onClick={() => navigate('/meu-perfil')} />
                            <Button text="Adicionar Projeto" onClick={() => navigate('/create-project')} />
                            <Button text="Meus Projetos" onClick={() => navigate('/meus-projetos')} />
                            <Button text="Preferências" onClick={() => navigate('/preferencias')} />
                            <Button text="Logout" onClick={handleLogout} />
                        </div>
                    )}
                </div>
            ) : (
                <Button text="Logar" onClick={() => navigate('/login')} />
            )}
        </div>
    )
}

export default Header
