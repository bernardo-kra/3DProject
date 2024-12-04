const express = require('express')
const router = express.Router()
const { s3, upload } = require('../config/s3Config')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const Project = require('../models/Project')
const verifyToken = require('../middleware/verifyToken')

// Função para gerar um caminho único para os arquivos
const generateFilePath = (projectName, userId, originalName) => {
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '-')
    const sanitizedFileName = originalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    return `uploads/${sanitizedProjectName}-${userId}/${uniqueSuffix}-${sanitizedFileName}`
}

// Função para validar tipos de arquivos
const validateFileType = (file, allowedTypes) => {
    const extension = file.originalname.split('.').pop().toLowerCase()
    return allowedTypes.includes(extension)
}

// Endpoint para fazer upload ou atualizar um projeto
router.post('/upload', verifyToken, upload.fields([
    { name: 'coverImage', maxCount: 10 },
    { name: 'file3D', maxCount: 1 }
]), async (req, res) => {
    if (!req.files || !req.files.coverImage || !req.files.file3D) {
        return res.status(400).json({ mensagem: 'Nenhum arquivo enviado.' })
    }

    const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif']
    const allowed3DTypes = ['stl', 'obj', 'fbx', 'dae', '3ds', 'glb', 'gltf']

    const uploadedFiles = []
    try {
        const projectName = req.body.projectName
        const userId = req.user._id.toString()
        const visibility = req.body.visibility || 'private' // Valor padrão correto
        const status = req.body.status || 'active' // Valor padrão correto
        const projectDate = req.body.projectDate ? new Date(req.body.projectDate) : new Date()

        // Validação de visibility
        if (!['public', 'private'].includes(visibility)) {
            return res.status(400).json({ mensagem: 'Visibility must be either public or private.' })
        }

        // Validação de status
        if (!['active', 'archived'].includes(status)) {
            return res.status(400).json({ mensagem: 'Status must be either active or archived.' })
        }

        const projectId = `${projectName}-${userId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
        const imageUrls = []
        const coverImageKeys = []

        // Upload das imagens de capa
        for (const imageFile of req.files.coverImage) {
            const sanitizedImageName = imageFile.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
            const imagePath = generateFilePath(projectName, userId, sanitizedImageName)

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

        // Upload do arquivo 3D
        const file3DFile = req.files.file3D[0]
        const sanitizedFileName = file3DFile.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
        const file3DPath = generateFilePath(projectName, userId, sanitizedFileName)

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
            projectId: projectId,
            user: userId,
            projectName: projectName,
            projectRepresentative: req.body.projectRepresentative,
            description: req.body.description,
            coverImage: imageUrls,
            filePath: file3DUrl,
            fileName: sanitizedFileName,
            coverImageKey: coverImageKeys,
            file3DKey: file3DPath,
            projectDate: projectDate,
            status: status,
            visibility: visibility
        })        

        await project.save()
        return res.status(201).json({ mensagem: 'Projeto criado com sucesso', project })
    } catch (error) {
        console.error('Erro ao salvar arquivos no S3 ou banco de dados:', error)

        for (const file of uploadedFiles) {
            try {
                await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: file.key }))
            } catch (cleanupError) {
                console.error(`Erro ao remover ${file.key} durante a limpeza`, cleanupError)
            }
        }

        // Verificação específica para duplicatas no projectId
        if (error.code === 11000 && error.keyPattern && error.keyPattern.projectId) {
            return res.status(400).json({ mensagem: 'Você já adicionou esse projeto' })
        }

        return res.status(500).json({ mensagem: 'Erro ao salvar informações do projeto', error: error.message })
    }
})


router.get('/project/:id', verifyToken, async (req, res) => {
    const projectId = req.params.id
    const userId = req.user._id.toString()
    const isAdmin = req.user.isAdmin

    try {
        const project = await Project.findOne({ projectId: projectId })

        if (!project) {
            return res.status(404).json({ mensagem: 'Projeto não encontrado' })
        }

        if (project.user.toString() !== userId && !isAdmin) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para visualizar este projeto' })
        }

        res.status(200).json({ project })
    } catch (error) {
        console.error('Erro ao obter o projeto:', error)
        res.status(500).json({ mensagem: 'Erro ao obter o projeto', error: error.message })
    }
})

router.delete('/project/:id', verifyToken, async (req, res) => {
    const projectId = req.params.id
    const userId = req.user._id.toString()
    const isAdmin = req.user.isAdmin

    try {
        const project = await Project.findOne({ projectId: projectId })

        if (!project) {
            return res.status(404).json({ mensagem: 'Projeto não encontrado' })
        }

        if (project.user.toString() !== userId && !isAdmin) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para excluir este projeto' })
        }

        if (project.coverImageKey && project.coverImageKey.length > 0) {
            for (const key of project.coverImageKey) {
                try {
                    await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key }))
                } catch (error) {
                    console.error(`Erro ao deletar imagem de capa: ${key}`, error)
                }
            }
        }

        if (project.file3DKey) {
            try {
                await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: project.file3DKey }))
            } catch (error) {
                console.error(`Erro ao deletar arquivo 3D: ${project.file3DKey}`, error)
            }
        }

        await Project.deleteOne({ projectId: projectId })

        res.status(200).json({ mensagem: 'Projeto excluído com sucesso' })
    } catch (error) {
        console.error('Erro ao excluir o projeto:', error)
        res.status(500).json({ mensagem: 'Erro ao excluir o projeto', error: error.message })
    }
})

router.put('/project/:id', verifyToken, upload.fields([{ name: 'coverImage', maxCount: 10 }, { name: 'file3D', maxCount: 1 }]), async (req, res) => {
    const projectId = req.params.id
    const userId = req.user._id.toString()

    try {
        const project = await Project.findOne({ projectId: projectId })

        if (!project) {
            return res.status(404).json({ mensagem: 'Projeto não encontrado' })
        }

        if (project.user.toString() !== userId) {
            return res.status(403).json({ mensagem: 'Você não tem permissão para editar este projeto' })
        }

        const updatedFields = {}
        const uploadedFiles = []

        const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif']
        const allowed3DTypes = ['stl', 'obj', 'fbx', 'dae', '3ds', 'glb', 'gltf']

        // Lógica para atualizar a imagem de capa
        if (req.files.coverImage && req.files.coverImage.length > 0) {
            // Remover imagens antigas
            if (project.coverImageKey && project.coverImageKey.length > 0) {
                for (const key of project.coverImageKey) {
                    try {
                        await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key }))
                    } catch (error) {
                        console.error(`Erro ao deletar imagem de capa antiga: ${key}`, error)
                    }
                }
            }

            const imageUrls = []
            const coverImageKeys = []

            for (const imageFile of req.files.coverImage) {
                if (!validateFileType(imageFile, allowedImageTypes)) {
                    return res.status(400).json({ mensagem: 'coverImage deve ser uma imagem válida.' })
                }

                const imagePath = generateFilePath(project.projectName, userId, imageFile.originalname)

                const imageUpload = new Upload({
                    client: s3,
                    params: {
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: imagePath,
                        Body: imageFile.buffer,
                        ContentType: imageFile.mimetype,
                        Metadata: { userid: userId, visibility: project.visibility }
                    },
                    leavePartsOnError: false
                })

                await imageUpload.done()
                imageUrls.push(`https://d39o5ylj4nzj6k.cloudfront.net/${imagePath}`)
                coverImageKeys.push(imagePath)
                uploadedFiles.push({ key: imagePath, userId, visibility: project.visibility })
            }

            updatedFields.coverImage = imageUrls
            updatedFields.coverImageKey = coverImageKeys
        }

        // Lógica para atualizar o arquivo 3D
        if (req.files.file3D && req.files.file3D.length > 0) {
            if (project.file3DKey) {
                try {
                    await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: project.file3DKey }))
                } catch (error) {
                    console.error(`Erro ao deletar arquivo 3D antigo: ${project.file3DKey}`, error)
                }
            }

            const file3DFile = req.files.file3D[0]

            if (!validateFileType(file3DFile, allowed3DTypes)) {
                return res.status(400).json({ mensagem: 'file3D deve ser um arquivo 3D válido.' })
            }

            const file3DPath = generateFilePath(project.projectName, userId, file3DFile.originalname)

            const file3DUpload = new Upload({
                client: s3,
                params: {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: file3DPath,
                    Body: file3DFile.buffer,
                    ContentType: file3DFile.mimetype,
                    Metadata: { userid: userId, visibility: project.visibility }
                },
                leavePartsOnError: false
            })

            await file3DUpload.done()
            const file3DUrl = `https://d39o5ylj4nzj6k.cloudfront.net/${file3DPath}`
            uploadedFiles.push({ key: file3DPath, userId, visibility: project.visibility })

            updatedFields.filePath = file3DUrl
            updatedFields.fileName = file3DFile.originalname
            updatedFields.file3DKey = file3DPath
        }

        // Update other fields if provided
        if (req.body.projectName) updatedFields.projectName = req.body.projectName
        if (req.body.projectRepresentative) updatedFields.projectRepresentative = req.body.projectRepresentative
        if (req.body.description) updatedFields.description = req.body.description
        if (req.body.visibility) {
            if (!['public', 'private'].includes(req.body.visibility)) {
                return res.status(400).json({ mensagem: 'Visibility must be either public or private.' })
            }
            updatedFields.visibility = req.body.visibility
        }
        if (req.body.status) {
            if (!['active', 'archived'].includes(req.body.status)) {
                return res.status(400).json({ mensagem: 'Status must be either active or archived.' })
            }
            updatedFields.status = req.body.status
        }
        if (req.body.projectDate) updatedFields.projectDate = req.body.projectDate

        const updatedProject = await Project.findOneAndUpdate({ projectId: projectId }, updatedFields, { new: true })

        res.status(200).json({ mensagem: 'Projeto atualizado com sucesso', project: updatedProject })

    } catch (error) {
        console.error('Erro ao atualizar o projeto:', error)

        for (const file of uploadedFiles) {
            try {
                await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: file.key }))
            } catch (cleanupError) {
                console.error(`Erro ao remover ${file.key} durante a limpeza`, cleanupError)
            }
        }

        res.status(500).json({ mensagem: 'Erro ao atualizar o projeto', error: error.message })
    }
})

module.exports = router
