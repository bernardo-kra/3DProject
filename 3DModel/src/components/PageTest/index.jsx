import React, { useContext } from 'react'
import { ThemeContext } from '@common/ThemeContext'
import { FaArrowRight } from 'react-icons/fa'
import Button from '@common/Button'
import Container from '@common/Container'
import Text from '@common/Text'

const PageTest = () => {
  const { changeTheme } = useContext(ThemeContext)

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Container size="small" margin="base" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <Button text="Tema Claro" onClick={() => changeTheme('light')} />
        <Button text="Tema Escuro" onClick={() => changeTheme('dark')} />
        <Button text="Tema Azul" onClick={() => changeTheme('blue')} />
      </Container>

      <Container size="medium" padding="large" margin="medium" style={{ textAlign: 'center' }}>
        <Text element="h2" size="large">Selecione um Tema</Text>
        <Text element="p" size="base">Escolha o tema que você deseja aplicar ao aplicativo.</Text>
      </Container>

      <Container size="large" padding="medium" margin="xlarge" style={{ textAlign: 'center' }}>
        <Button text="Comece a Explorar" icon={<FaArrowRight />} onClick={() => alert('Click')} />
      </Container>

      <Container size="xlarge" padding="small" margin="large" className="custom-class" style={{ textAlign: 'center' }}>
        <Text element="h3" size="medium">Bem-vindo!</Text>
        <Text element="p" size="base">Explore nosso conteúdo e divirta-se!</Text>
      </Container>
    </div>
  )
}

export default PageTest
