const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ mensagem: 'Usuário já cadastrado' })
        const user = new User({ firstName, lastName, email, phone, password: hashedPassword })
        await user.save()
        res.status(201).json({ mensagem: `Usuário criado: ${user._id}` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensagem: 'Erro interno do servidor', error: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas' })
        }
        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.TOKEN_SIGNATURE, { expiresIn: '3h' })
        res.status(200).json({ token, user: { _id: user._id, email: user.email } })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
})

router.post('/logout', (req, res) => {
    res.status(200).json({ mensagem: 'Logout bem-sucedido' })
})

module.exports = router
