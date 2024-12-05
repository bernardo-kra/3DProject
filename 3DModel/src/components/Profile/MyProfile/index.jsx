import React, { useState, useEffect, useContext } from 'react'
import { useAuth } from '@context/AuthContext'
import { ThemeContext } from '@context/ThemeContext'
import { Button, Input, Container, Text, Loading } from '@common'
import { PROFILE_URL } from '@variables'
import { FiUpload } from 'react-icons/fi'
import './styles.css'

const Profile = () => {
    const { authToken } = useAuth()
    const { theme, changeTheme } = useContext(ThemeContext)
    const [user, setUser] = useState(null)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [profileImage, setProfileImage] = useState(null)
    const [profileImageUrl, setProfileImageUrl] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            try {
                const response = await fetch(PROFILE_URL, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                const data = await response.json()
                setUser(data.user)
                setFirstName(data.user.firstName || '')
                setLastName(data.user.lastName || '')
                setPhone(data.user.phone || '')
                setProfileImageUrl(data.user.profileImage || '')
            } catch (error) {
                console.error('Erro ao obter perfil:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [authToken])

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0]
        setProfileImage(file)
    }

    const handleUpdateProfile = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('phone', phone)
            if (profileImage) {
                formData.append('profileImage', profileImage)
            }

            const response = await fetch(PROFILE_URL, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            })
            const data = await response.json()
            setUser(data.user)
            setProfileImageUrl(data.user.profileImage)
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !user) {
        return <Loading isLoading={true} />
    }

    return (
        <Container className="Profile">
            <Text element="h1">Meu Perfil</Text>

            <div className="Profile-form">
                <div className="Profile-inputGroup">
                    <Text element="label">Primeiro Nome</Text>
                    <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="Profile-inputGroup">
                    <Text element="label">Último Nome</Text>
                    <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="Profile-inputGroup">
                    <Text element="label">Telefone</Text>
                    <Input
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="Profile-inputGroup">
                    <Text element="label">Imagem de Perfil</Text>
                    <div
                        className="Profile-fileUpload"
                        onClick={() => document.getElementById('profile-image-upload').click()}
                    >
                        <FiUpload size={24} />
                        <Input
                            type="file"
                            id="profile-image-upload"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            className="Profile-fileInput"
                            style={{ display: 'none' }}
                        />
                        {profileImage && <Text>{profileImage.name}</Text>}
                    </div>
                    {profileImageUrl && (
                        <img
                            src={profileImageUrl}
                            alt="Imagem de perfil"
                            className="Profile-imagePreview"
                        />
                    )}
                </div>

                <Button text="Atualizar Perfil" onClick={handleUpdateProfile} />
            </div>

            <div className="Profile-themeSwitcher">
                <Text element="h2">Configurações de Tema</Text>
                <div className="Profile-themeButtons">
                    <Button text="Tema Claro" onClick={() => changeTheme('light')} />
                    <Button text="Tema Escuro" onClick={() => changeTheme('dark')} />
                    <Button text="Tema Azul" onClick={() => changeTheme('blue')} />
                </div>
            </div>
        </Container>
    )
}

export default Profile
