const express = require('express')
const { s3, upload } = require('../config/s3Config')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const Project = require('../models/Project')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()

const generateFilePath = (projectName, userId, originalName) => {
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '-')
    const sanitizedFileName = originalName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9.-]/g, '')
    return `uploads/${sanitizedProjectName}-${userId}/${sanitizedFileName}`
}

const validateFileType = (file, allowedTypes) => {
    const extension = file.originalname.split('.').pop().toLowerCase()
    return allowedTypes.includes(extension)
}

router.post('/upload', verifyToken, upload.fields([{ name: 'coverImage', maxCount: 10 }, { name: 'file3D', maxCount: 1 }]), async (req, res) => {
    if (!req.files || !req.files.coverImage || !req.files.file3D) {
        return res.status(400).json({ mensagem: 'Nenhum arquivo enviado.' })
    }

    const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif']
    const allowed3DTypes = ['stl', 'obj', 'fbx', 'dae', '3ds', 'glb']

    if (!validateFileType(req.files.coverImage[0], allowedImageTypes)) {
        return res.status(400).json({ mensagem: 'coverImage deve ser uma imagem (jpg, jpeg, png, gif).' })
    }

    if (!validateFileType(req.files.file3D[0], allowed3DTypes)) {
        return res.status(400).json({ mensagem: 'file3D deve ser um arquivo 3D (stl, obj, fbx, dae, 3ds, glb).' })
    }

    const uploadedFiles = []
    try {
        const projectName = req.body.projectName
        const userId = req.user._id.toString()
        const visibility = req.body.visibility || 'private'
        const status = req.body.status || 'active'
        const imageUrls = []
        const coverImageKeys = []

        for (const imageFile of req.files.coverImage) {
            const imagePath = generateFilePath(projectName, userId, imageFile.originalname)

            const imageUpload = new Upload({
                client: s3,
                params: {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: imagePath,
                    Body: imageFile.buffer,
                    ContentType: imageFile.mimetype,
                    Metadata: { userid: userId, visibility: visibility }
                },
                leavePartsOnError: false
            })

            await imageUpload.done()
            imageUrls.push(`https://d39o5ylj4nzj6k.cloudfront.net/${imagePath}`)
            coverImageKeys.push(imagePath)
            uploadedFiles.push({ key: imagePath, userId, visibility })
        }

        const file3DFile = req.files.file3D[0]
        const file3DPath = generateFilePath(projectName, userId, file3DFile.originalname)

        const file3DUpload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: file3DPath,
                Body: file3DFile.buffer,
                ContentType: file3DFile.mimetype,
                Metadata: { userid: userId, visibility: visibility }
            },
            leavePartsOnError: false
        })

        await file3DUpload.done()
        const file3DUrl = `https://d39o5ylj4nzj6k.cloudfront.net/${file3DPath}`
        uploadedFiles.push({ key: file3DPath, userId, visibility })

        const project = new Project({
            id: `${projectName}-${userId}-${Date.now()}`,
            user: userId,
            projectName: projectName,
            projectRepresentative: req.body.projectRepresentative,
            description: req.body.description,
            coverImage: imageUrls,
            filePath: file3DUrl,
            fileName: file3DFile.originalname,
            coverImageKey: coverImageKeys,
            file3DKey: file3DPath,
            projectDate: new Date(),
            status: status
        })

        await project.save()
        res.status(201).json({ mensagem: 'Arquivos enviados com sucesso', project })
    } catch (error) {
        console.error('Erro ao salvar arquivos no S3 ou banco de dados:', error)
        for (const file of uploadedFiles) {
            try {
                await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: file.key }))
            } catch (cleanupError) {
                console.error(`Erro ao remover ${file.key} durante a limpeza`, cleanupError)
            }
        }

        res.status(500).json({ mensagem: 'Erro ao salvar informações do projeto', error: error.message })
    }
})

module.exports = router
