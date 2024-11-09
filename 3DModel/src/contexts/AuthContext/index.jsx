import { VERIFY_TOKEN_URL, LOGOUT_URL } from '@variables/index'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '@common'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      verifyToken(token)
    } else {
      setLoading(false) // Token ausente
    }
  }, [])

  const apiRequest = async (url, method) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
      return response
    } catch (error) {
      console.error('Erro de rede:', error)
      throw new Error('Erro de rede')
    }
  }

  const verifyToken = async (token) => {
    try {
      const response = await apiRequest(VERIFY_TOKEN_URL, 'POST')

      if (response.ok) {
        setIsAuthenticated(true)
      } else if (response.status === 404) {
        console.warn('Endpoint de verificação não encontrado.')
        handleInvalidToken()
      } else {
        console.warn('Token inválido')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Erro ao verificar o token:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }


  const handleInvalidToken = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  const login = (token) => {
    localStorage.setItem('authToken', token)
    setIsAuthenticated(true)
    navigate('/home')
  }

  const logout = async () => {
    try {
      const response = await apiRequest(LOGOUT_URL, 'POST')
      if (response.ok) {
        localStorage.removeItem('authToken')
        setIsAuthenticated(false)
        navigate('/login')
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
