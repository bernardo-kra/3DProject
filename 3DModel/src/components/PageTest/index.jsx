import React, { useContext } from 'react'
import { ThemeContext } from '@common/ThemeContext'
import { FaArrowRight } from 'react-icons/fa'
import Button from '@common/Button'
import Container from '@common/Container'

const PageTest = () => {
  const { changeTheme } = useContext(ThemeContext)

  return (
    <div style={{ padding: '10px' }}>
      <Container size="small" margin="base">
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

      <Container size="medium" padding="large" margin="medium">
        <h2>Selecione um Tema</h2>
        <p>Escolha o tema que você deseja aplicar ao aplicativo.</p>
      </Container>

      <Container size="large" padding="medium" margin="xlarge">
        <Button
          text="Comece a Explorar"
          icon={<FaArrowRight />}
          onClick={() => alert('Click')}
        />
      </Container>

      <Container size="xlarge" padding="small" margin="large" className="custom-class">
        <h3>Bem-vindo!</h3>
        <p>Explore nosso conteúdo e divirta-se!</p>
      </Container>
    </div>
  )
}

export default PageTest
