const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()
const { s3, upload } = require('../config/s3Config')
const { Upload } = require('@aws-sdk/lib-storage')
const mongoose = require('mongoose')
const verifyToken = require('../middleware/verifyToken')

router.post('/register', upload.single('profileImage'), async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body
    const profileImageFile = req.file

    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ mensagem: 'Usuário já cadastrado' })

        let profileImageUrl = null

        const userId = new mongoose.Types.ObjectId()

        if (profileImageFile) {
            const imagePath = `profile-images/${userId}/${profileImageFile.originalname}`

            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: imagePath,
                Body: profileImageFile.buffer,
                ContentType: profileImageFile.mimetype,
                Metadata: { userId: userId.toString() }
            }

            const uploadInstance = new Upload({
                client: s3,
                params: uploadParams
            })

            await uploadInstance.done()
            profileImageUrl = `https://d39o5ylj4nzj6k.cloudfront.net/${imagePath}`
        }

        const user = new User({
            _id: userId,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            profileImage: profileImageUrl,
            isAdmin: false
        })
        await user.save()
        res.status(201).json({ mensagem: `Usuário criado: ${user._id}` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensagem: 'Erro interno do servidor', error: error.message })
    }
})

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' })
        }
        res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
})

router.put('/profile', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        const userId = req.user._id
        const { firstName, lastName, password, phone } = req.body
        const profileImageFile = req.file

        const updatedFields = {}

        if (firstName) updatedFields.firstName = firstName
        if (lastName) updatedFields.lastName = lastName
        if (phone) updatedFields.phone = phone
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updatedFields.password = hashedPassword
        }

        if (profileImageFile) {
            const imagePath = `profile-images/${userId}/${profileImageFile.originalname}`

            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: imagePath,
                Body: profileImageFile.buffer,
                ContentType: profileImageFile.mimetype,
                Metadata: { userId: userId.toString() }
            }

            const uploadInstance = new Upload({
                client: s3,
                params: uploadParams
            })

            await uploadInstance.done()
            const profileImageUrl = `https://d39o5ylj4nzj6k.cloudfront.net/${imagePath}`
            updatedFields.profileImage = profileImageUrl
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true }).select('-password')
        res.status(200).json({ mensagem: 'Perfil atualizado com sucesso', user: updatedUser })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensagem: 'Erro interno do servidor' })
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
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
                profileImage: user.profileImage,
                firstName: user.firstName,
                lastName: user.lastName
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
})

router.post('/logout', (req, res) => {
    res.status(200).json({ mensagem: 'Logout bem-sucedido' })
})

module.exports = router
