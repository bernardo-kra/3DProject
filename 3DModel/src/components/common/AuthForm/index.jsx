import React, { useState, useContext } from 'react'
import { ThemeContext } from '@common/ThemeContext'
import Button from '@common/Button'
import Input from '@common/Input'
import Container from '@common/Container'
import Text from '@common/Text'
import { useNavigate } from 'react-router-dom'
import useValidation from './userValidation/userValidation'
import './styles.css'

const AuthForm = () => {
    const { changeTheme } = useContext(ThemeContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [activeTab, setActiveTab] = useState('login')
    const { error, validateName, validateEmail, validatePassword, validateConfirmPassword } = useValidation()
    const navigate = useNavigate()

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        navigate(`/${tab}`)
    }

    const handleLogin = async () => {
        if (!validateEmail(email) || !validatePassword(password)) return
        // TODO: Adicionar chamada de API para login
        alert('.')
    }

    const handleRegister = async () => {
        if (!validateName(name) || !validateEmail(email) || !validatePassword(password) || !validateConfirmPassword(password, confirmPassword)) return
        // TODO: Adicionar chamada de API para registro
        alert('.')
    }

    return (
        <div className='AuthForm'>
            <Container
                size="medium"
                padding="large"
                margin="large"
                alignItems="center"
                justifyContent="center"
                className="AuthForm-container"
            >
                <div className="AuthForm-tabs">
                    <Button
                        className={`AuthForm-tab ${activeTab === 'login' ? 'active' : ''}`}
                        text="Login"
                        onClick={() => handleTabChange('login')}
                    />
                    <Button
                        className={`AuthForm-tab ${activeTab === 'register' ? 'active' : ''}`}
                        text="Registro"
                        onClick={() => handleTabChange('register')}
                    />
                </div>

                <div className='AuthForm-inputGroupContainer'>
                    {activeTab === 'register' && (
                        <div className="AuthForm-inputGroup">
                            <Text className="AuthForm-inputLabel" element="label" size="small">Nome Completo</Text>
                            <Input
                                type="text"
                                placeholder="Digite seu nome completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="AuthForm-inputGroup">
                        <Text className="AuthForm-inputLabel" element="label" size="small">Email</Text>
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="AuthForm-inputGroup">
                        <Text className="AuthForm-inputLabel" element="label" size="small">Senha</Text>
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {activeTab === 'register' && (
                        <div className="AuthForm-inputGroup">
                            <Text className="AuthForm-inputLabel" element="label" size="small">Confirmar Senha</Text>
                            <Input
                                type="password"
                                placeholder="Confirme sua senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <Button
                        className="AuthForm-button"
                        text={activeTab === 'login' ? 'Entrar' : 'Registrar'}
                        onClick={activeTab === 'login' ? handleLogin : handleRegister}
                    />
                </div>

                {error && <Text element="p" size="small" className="AuthForm-error">{error}</Text>}

                {activeTab === 'login' && (
                    <Text element="a" size="base" className="AuthForm-forgotPassword" href="#">Esqueceu a senha?</Text>
                )}

                <Text element="p" size="base" className="AuthForm-terms">
                    {activeTab === 'login'
                        ? 'Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.'
                        : 'Ao se registrar, você concorda com nossos Termos de Uso e Política de Privacidade.'}
                </Text>

                <Container size="small" margin="base" className="AuthForm-themeButtons">
                    <Button
                        text="Tema Claro"
                        onClick={() => changeTheme('light')}
                    />
                    <Button
                        text="Tema Escuro"
                        onClick={() => changeTheme('dark')}
                    />
                    <Button
                        text="Tema Azul"
                        onClick={() => changeTheme('blue')}
                    />
                </Container>
            </Container>
        </div>
    )
}

export default AuthForm
