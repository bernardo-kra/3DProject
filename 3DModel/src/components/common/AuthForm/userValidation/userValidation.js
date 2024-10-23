import { useState } from 'react'

const useValidation = () => {
    const [error, setError] = useState('')

    const validateName = (name) => {
        if (name.length <= 3 || !name.includes(' ')) {
            setError('Por favor, insira seu nome completo (pelo menos 3 letras e um sobrenome).')
            return false
        }
        setError('')
        return true
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Por favor, insira um email válido.')
            return false
        }
        setError('')
        return true
    }

    const validatePassword = (password) => {
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            setError('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número.')
            return false
        }
        setError('')
        return true
    }

    const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.')
            return false
        }
        setError('')
        return true
    }

    return {
        error,
        validateName,
        validateEmail,
        validatePassword,
        validateConfirmPassword
    }
}

export default useValidation
