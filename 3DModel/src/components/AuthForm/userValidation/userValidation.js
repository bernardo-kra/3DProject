import { useState } from 'react'

const useValidation = () => {
    const [error, setError] = useState('')

    const validateName = (name) => {
        if (name.length <= 3 || !name.includes(' ')) {
            return 'Por favor, insira seu nome completo (pelo menos 3 letras e um sobrenome).'
        }
        return ''
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return 'Por favor, insira um email válido.'
        }
        return ''
    }

    const validatePassword = (password) => {
        // TODO
        // if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        //     return 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número.'
        // }
        return ''
    }

    const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return 'As senhas não coincidem.'
        }
        return ''
    }

    const validate = (name, email, password, confirmPassword) => {
        const nameError = validateName(name)
        const emailError = validateEmail(email)
        const passwordError = validatePassword(password)
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword)
        const errors = [nameError, emailError, passwordError, confirmPasswordError].filter(Boolean)

        if (errors.length > 0) {
            setError(errors.join('. '))
            return false
        }

        setError('')
        return true
    }

    return {
        error,
        validate,
        validateName,
        validateEmail,
        validatePassword,
        validateConfirmPassword
    }
}

export default useValidation
