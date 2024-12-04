import { VERIFY_TOKEN_URL, LOGOUT_URL, PROFILE_URL } from '@variables/index'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '@common'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null)
  const [isAuthenticated, setIsAuthenticated] = useState(!!authToken)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (authToken) {
      verifyToken(authToken)
    } else {
      setLoading(false)
    }
  }, [authToken])

  const verifyToken = async (token) => {
    try {
      const response = await fetch(VERIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setIsAuthenticated(true)
        await fetchUserData(token)
      } else {
        handleInvalidToken()
      }
    } catch (error) {
      console.error('Erro ao verificar o token:', error)
      handleInvalidToken()
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async (token) => {
    try {
      const userResponse = await fetch(PROFILE_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      } else {
        console.error('Falha ao obter os dados do usuário:', userResponse.statusText)
      }
    } catch (error) {
      console.error('Erro ao obter os dados do usuário:', error)
    }
  }

  const handleInvalidToken = () => {
    setAuthToken(null)
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  const login = (token) => {
    localStorage.setItem('authToken', token)
    setAuthToken(token)
    setIsAuthenticated(true)
    fetchUserData(token)
    navigate('/home')
  }

  const logout = async () => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
      if (response.ok) {
        handleInvalidToken()
      } else {
        console.error('Erro ao fazer logout')
      }
    } catch (error) {
      console.error('Erro ao fazer logout', error)
    }
  }

  if (loading) {
    return <Loading isLoading={true} />
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
