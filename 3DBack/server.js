// server.js
const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
