import React, { useContext } from 'react'
import { ThemeContext } from '@context/ThemeContext'
import './styles.css'
const Home = () => {
    const { theme, changeTheme } = useContext(ThemeContext)

    return (
        <div className="home-container">
            <h1 className="home-title">Bem-vindo ao Projeto!</h1>
            <div className="theme-buttons">
                <button
                    className={`theme-button ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => changeTheme('light')}
                >
                    Light Mode
                </button>
                <button
                    className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => changeTheme('dark')}
                >
                    Dark Mode
                </button>
                <button
                    className={`theme-button ${theme === 'blue' ? 'active' : ''}`}
                    onClick={() => changeTheme('blue')}
                >
                    Blue Mode
                </button>
            </div>
        </div>
    )
}

export default Home
