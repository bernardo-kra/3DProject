import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Text, Button } from '@common'
import './styles.css'

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()
    const menuRef = useRef(null) // Referência para o menu
    const avatarRef = useRef(null) // Referência para o avatar

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const toggleMenu = () => {
        setMenuOpen(prev => !prev)
    }

    const handleClickOutside = (event) => {
        // Verifica se o clique foi fora do menu e fora do avatar
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            avatarRef.current &&
            !avatarRef.current.contains(event.target)
        ) {
            setMenuOpen(false)
        }
    }

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [menuOpen])

    return (
        <header className="Header">
            <div className="Header-content">
                <div className="Header-logo">
                    <Text size="large" element="p" className="Header-title">Meu Projeto</Text>
                </div>

                <nav className="Header-nav">
                    <Button text="Home" onClick={() => navigate('/home')} />
                    <Button text="About" onClick={() => navigate('/about')} />
                    <Button text="Contact" onClick={() => navigate('/contact')} />
                    <Button text="Components" onClick={() => navigate('/components')} />

                    {isAuthenticated ? (
                        <>
                            <div className="Header-avatarWrapper" onClick={toggleMenu} ref={avatarRef}>
                                <img src={user?.profileImage || '/default-avatar.png'} alt="User Avatar" className="Header-avatar" />
                                <Text size="small" element="p" className="Header-username">{user?.name}</Text>
                            </div>
                            {menuOpen && (
                                <div ref={menuRef} className="Header-menu">
                                    <Button text="Meu Perfil" onClick={() => navigate('/meu-perfil')} />
                                    <Button text="Adicionar Projeto" onClick={() => navigate('/create-project')} />
                                    <Button text="Meus Projetos" onClick={() => navigate('/my-projects')} />
                                    <Button text="Preferências" onClick={() => navigate('/preferencias')} />
                                    <Button text="Logout" onClick={handleLogout} />
                                </div>
                            )}
                        </>
                    ) : (
                        <Button text="Logar" onClick={() => navigate('/login')} />
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header
