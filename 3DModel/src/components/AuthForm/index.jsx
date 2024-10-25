import React, { useState, useContext } from 'react'
import { ThemeContext } from '@context/ThemeContext'
import { Button, Input, Container, Text, Loading, Modal } from '@common'
import { useNavigate } from 'react-router-dom'
import useValidation from './userValidation/userValidation'
import './styles.css'
import { LOGIN_URL, REGISTER_URL } from '@variables'
import { useAuth } from '@context/AuthContext'

const AuthForm = () => {
    const { changeTheme } = useContext(ThemeContext)
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [activeTab, setActiveTab] = useState('login')
    const [loading, setLoading] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState('')
    const { validateName, validateEmail, validatePassword, validateConfirmPassword } = useValidation()
    const navigate = useNavigate()
    const [modalTitle, setModalTitle] = useState('')
    const [modalDescription, setModalDescription] = useState('')


    const handleTabChange = (tab) => {
        setActiveTab(tab)
        navigate(`/${tab}`)
        setError('')
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    const openModal = (title, description) => {
        setModalTitle(title)
        setModalDescription(description)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setModalMessage('')
    }

    const handleLogin = async () => {
        setError('')
        if (activeTab === 'login' && (!email.trim() || !password.trim())) {
            setError('Por favor, preencha todos os campos corretamente.')
            return
        }
        setLoading(true)

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (errorData.message) {
                    setError(errorData.message)
                } else {
                    setError('Login ou senha não estão corretos.')
                }
                throw new Error('Login failed')
            }

            const data = await response.json()
            login(data.token)
            openModal(`Bem-vindo, ${data.user.email}!`)
            navigate('/home')
        } catch (error) {
            console.error('Login error:', error)
            openModal('Erro ao fazer login: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async () => {
        setError('')

        const nameError = validateName(name)
        const emailError = validateEmail(email)
        const passwordError = validatePassword(password)
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword)

        if (nameError || emailError || passwordError || confirmPasswordError) {
            setError([nameError, emailError, passwordError, confirmPasswordError].filter(Boolean).join('. '))
            return
        }

        const nameParts = name.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || firstName

        setLoading(true)
        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password })
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.mensagem || 'Registration failed')
            }
            openModal('Cadastrado com sucesso!', 'Você será redirecionado ao login.')
            setActiveTab('login')
        } catch (error) {
            console.error('Registration error:', error)
            openModal('Erro ao registrar', error.message)
        } finally {
            setLoading(false)
        }
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
                style={{ position: 'relative' }}
            >
                {loading && <Loading isLoading={loading} />}

                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalTitle}
                >
                    <Text element="p" size="medium">{modalMessage}</Text>
                    <Text size="small">{modalDescription}</Text>
                    <Button text="Fechar" onClick={closeModal} />
                </Modal>

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
                                className={(!name.trim() && error) ? 'input-error' : ''}
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
                            className={(!email.trim() && error) ? 'input-error' : ''}
                        />
                    </div>

                    <div className="AuthForm-inputGroup">
                        <Text className="AuthForm-inputLabel" element="label" size="small">Senha</Text>
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={(!password.trim() && error) ? 'input-error' : ''}
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
                                className={(!confirmPassword.trim() && error) ? 'input-error' : ''}
                            />
                        </div>
                    )}

                    <Button
                        className="AuthForm-button"
                        text={activeTab === 'login' ? (loading ? 'Carregando...' : 'Entrar') : (loading ? 'Carregando...' : 'Registrar')}
                        onClick={activeTab === 'login' ? handleLogin : handleRegister}
                        disabled={loading}
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
                    <Button text="Tema Claro" onClick={() => changeTheme('light')} />
                    <Button text="Tema Escuro" onClick={() => changeTheme('dark')} />
                    <Button text="Tema Azul" onClick={() => changeTheme('blue')} />
                </Container>
            </Container>
        </div >
    )
}

export default AuthForm
