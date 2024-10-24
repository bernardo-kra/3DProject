const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

const User = require('./models/User')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err))

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ mensagem: 'Access token not provided' })
  
    jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, decoded) => {
        if (err) return res.status(401).json({ mensagem: 'Invalid access token' })
        req.user = decoded
        next()
    })
}

app.post('/register', async (req, res) => {
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
        res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas' })
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SIGNATURE, { expiresIn: '3h' })
        res.status(200).json({ token, user: { id: user._id, email: user.email } })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
})

app.post('/logout', verifyToken, (req, res) => {
    res.status(200).json({ mensagem: 'Logout bem-sucedido' })
})

app.get('/protect', verifyToken, (req, res) => {
  return res.status(200).json({ mensagem: 'Acesso permitido', user: req.user })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})