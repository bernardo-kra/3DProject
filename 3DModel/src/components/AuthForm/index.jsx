import React, { useState, useContext, useEffect } from 'react'
import { ThemeContext } from '@context/ThemeContext'
import { Button, Input, Container, Text, Loading, Modal, Checkbox } from '@common'
import { useNavigate } from 'react-router-dom'
import useValidation from './userValidation/userValidation'
import './styles.css'
import { LOGIN_URL, REGISTER_URL } from '@variables'
import { useAuth } from '@context/AuthContext'
import { FiUpload } from 'react-icons/fi'

const AuthForm = () => {
    const { changeTheme } = useContext(ThemeContext)
    const { login, isAuthenticated } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [activeTab, setActiveTab] = useState('login')
    const [loading, setLoading] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState('')
    const { validateName, validateEmail, validatePassword, validateConfirmPassword } = useValidation()
    const navigate = useNavigate()
    const [modalTitle, setModalTitle] = useState('')
    const [modalDescription, setModalDescription] = useState('')
    const [profileImage, setProfileImage] = useState(null)

    useEffect(() => {
        if (isAuthenticated && (activeTab === 'login' || activeTab === 'register')) {
            navigate('/home')
        }
    }, [isAuthenticated, navigate, activeTab])

    useEffect(() => {
        const cachedCredentials = localStorage.getItem('cachedCredentials')
        if (cachedCredentials) {
            const credentials = JSON.parse(cachedCredentials)
            setEmail(credentials.email || '')
            setPassword(credentials.password || '')
            setRememberMe(true)
        }
    }, [])

    const saveCredentialsToCache = (email, password) => {
        const credentials = { email, password }
        localStorage.setItem('cachedCredentials', JSON.stringify(credentials))
    }

    const removeCredentialsFromCache = () => {
        localStorage.removeItem('cachedCredentials')
    }

    const handleRememberMeToggle = () => {
        setRememberMe((prev) => {
            const newRememberMe = !prev
            if (newRememberMe) {
                saveCredentialsToCache(email, password)
            } else {
                removeCredentialsFromCache()
            }
            return newRememberMe
        })
    }

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0]
        setProfileImage(file)
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        navigate(`/${tab}`)
        setError('')
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setPhone('')
        setProfileImage(null)
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
                if (errorData.mensagem) {
                    setError(errorData.mensagem)
                } else {
                    setError('Login ou senha não estão corretos.')
                }
                throw new Error('Login failed')
            }

            const data = await response.json()

            login(data.token, data.user)

            if (rememberMe) {
                saveCredentialsToCache(email, password)
            } else {
                removeCredentialsFromCache()
            }

            openModal(`Bem-vindo, ${data.user.email}!`, '')
            navigate('/home')
        } catch (error) {
            console.error('Login error:', error)
            openModal('Erro ao fazer login', error.message)
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
            const formData = new FormData()
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('phone', phone)
            if (profileImage) {
                formData.append('profileImage', profileImage)
            }

            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (activeTab === 'login') {
                handleLogin()
            } else {
                handleRegister()
            }
        }
    }

    useEffect(() => {
        if (!rememberMe) {
            removeCredentialsFromCache()
        }
    }, [email, password, rememberMe])

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
                    <Text element="p" size="small">{modalDescription}</Text>
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
                        <>
                            <div className="AuthForm-inputGroup">
                                <Text className="AuthForm-inputLabel" element="label" size="small">Nome Completo</Text>
                                <Input
                                    type="text"
                                    placeholder="Digite seu nome completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={(!name.trim() && error) ? 'input-error' : ''}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="AuthForm-inputGroup">
                                <Text className="AuthForm-inputLabel" element="label" size="small">Telefone</Text>
                                <Input
                                    type="tel"
                                    placeholder="(XX) XXXXX-XXXX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={(!phone.trim() && error) ? 'input-error' : ''}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="AuthForm-inputGroup">
                                <Text className="AuthForm-inputLabel" element="label" size="small">Imagem de Perfil</Text>
                                <div
                                    className="AuthForm-fileUpload"
                                    onClick={() => document.getElementById('profile-image-upload').click()}
                                >
                                    <FiUpload size={24} />
                                    <Input
                                        type="file"
                                        id="profile-image-upload"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="AuthForm-fileInput"
                                        style={{ display: 'none' }}
                                    />
                                    {profileImage && <Text>{profileImage.name}</Text>}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="AuthForm-inputGroup">
                        <Text className="AuthForm-inputLabel" element="label" size="small">Email</Text>
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={(!email.trim() && error) ? 'input-error' : ''}
                            onKeyDown={handleKeyDown}
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
                            onKeyDown={handleKeyDown}
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
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    )}

                    <Checkbox
                        label="Lembrar de mim"
                        checked={rememberMe}
                        onChange={handleRememberMeToggle}
                        className="AuthForm-rememberMe"
                    />

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
