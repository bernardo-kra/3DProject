import { LOGOUT_URL } from '@variables/index'
import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (token) => {
    localStorage.setItem('authToken', token)
    setIsAuthenticated(true)
    navigate('/home')
  }

  const logout = async () => {
    try {
      const response = await fetch(LOGOUT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (response.ok) {
        localStorage.removeItem('authToken')
        setIsAuthenticated(false)
        navigate('/login')
      } else {
        console.error('Erro ao fazer logout')
      }
    } catch (error) {
      console.error('Erro de rede:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
