import React, { useState, useContext } from 'react'
import { ThemeContext } from '@common/ThemeContext'
import Button from '@common/Button'
import Input from '@common/Input'
import Container from '@common/Container'
import Text from '@common/Text'
import './styles.css'

const LoginForm = () => {
  const { changeTheme } = useContext(ThemeContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='LoginForm'>
      <Container
        size="medium"
        padding="large"
        margin="large"
        alignItems="center"
        justifyContent="center"
        className="LoginForm-container"
      >
        <Text element="h1" size="large" className="LoginForm-title">Login</Text>
        <div className='LoginForm-inputGroupContainer'>

          <div className="LoginForm-inputGroup">
            <Text className="LoginForm-inputLabel" element="label" size="small">Email</Text>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="LoginForm-inputGroup">
            <Text className="LoginForm-inputLabel" element="label" size="small">Senha</Text>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="LoginForm-button"
            text="Entrar"
            onClick={() => alert('Entrando...')}
          />
        </div>
        <Text element="a" size="base" className="LoginForm-forgotPassword" href="#">Esqueceu a senha?</Text>
        <Text element="p" size="base" className="LoginForm-terms">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </Text>

        <Container size="small" margin="base" className="LoginForm-themeButtons">
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

export default LoginForm
