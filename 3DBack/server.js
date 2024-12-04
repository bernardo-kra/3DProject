const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const listAllRoute = require('./routes/listAllRoute')
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/projectRoutes')
const verifyToken = require('./middleware/verifyToken')

const http = require('http')

const app = express()

const server = http.createServer(app)

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err))

app.post('/api/verify-token', verifyToken, (req, res) => {
    res.status(200).json({ mensagem: 'Token válido' })
})

app.use('/api/users', userRoutes)
app.use('/api', uploadRoutes)
app.use('/api', listAllRoute)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = server
