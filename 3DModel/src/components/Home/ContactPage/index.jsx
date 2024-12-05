import React, { useState } from 'react'
import { Text, Button, Input } from '@common'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import './styles.css'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="contact-page-container">
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Text element="h1" className="contact-title">
          Entre em Contato Conosco
        </Text>
        <Text element="p" className="contact-subtitle">
          Estamos aqui para responder às suas perguntas e ajudar no que for preciso.
        </Text>
      </motion.div>

      <div className="contact-content">
        <motion.div
          className="contact-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="contact-info-item">
            <FiMail className="contact-icon" />
            <Text element="p">contato@empresa.com</Text>
          </div>
          <div className="contact-info-item">
            <FiPhone className="contact-icon" />
            <Text element="p">+55 (11) 1234-5678</Text>
          </div>
          <div className="contact-info-item">
            <FiMapPin className="contact-icon" />
            <Text element="p">Rua Exemplo, 123 - São Paulo, SP</Text>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Input
            type="text"
            name="name"
            placeholder="Seu Nome"
            value={formData.name}
            onChange={handleInputChange}
            className="contact-input"
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Seu Email"
            value={formData.email}
            onChange={handleInputChange}
            className="contact-input"
            required
          />
          <Input
            type="text"
            name="message"
            placeholder="Sua Mensagem"
            value={formData.message}
            onChange={handleInputChange}
            className="contact-textarea"
            required
          />
          <Button
            type="submit"
            text="Enviar Mensagem"
            icon={<FiSend />}
            className="contact-submit-button"
          />
        </motion.form>
      </div>
    </div>
  )
}

export default ContactPage
