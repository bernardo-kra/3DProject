const express = require('express')
const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3')
const verifyToken = require('../middleware/verifyToken')
const Project = require('../models/Project')
const { s3 } = require('../config/s3Config')
require('dotenv').config()

const router = express.Router()

router.get('/list-all', verifyToken, async (req, res) => {
    try {
        const dbProjects = await Project.find().populate('user', 'firstName lastName')

        const combinedData = dbProjects.map(project => ({
            projectId: project.projectId,
            projectName: project.projectName,
            projectRepresentative: project.projectRepresentative,
            description: project.description,
            coverImage: project.coverImage,
            filePath: project.filePath,
            fileName: project.fileName,
            projectDate: project.projectDate,
            user: project.user,
            status: project.status,
        }))

        res.status(200).json({ projects: combinedData })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar dados do banco', error: error.message })
    }
})

router.get('/list-all-s3', verifyToken, async (req, res) => {
    try {
        const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
        }

        const s3Data = await s3.send(new ListObjectsV2Command(s3Params))

        const items = await Promise.all(s3Data.Contents.map(async file => {
            try {
                const metadataResponse = await s3.send(new GetObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: file.Key,
                }))

                const userId = metadataResponse.Metadata?.userid || null
                const visibility = metadataResponse.Metadata?.visibility || 'private'

                return {
                    key: file.Key,
                    lastModified: file.LastModified,
                    size: file.Size,
                    storageClass: file.StorageClass,
                    userId: userId,
                    visibility: visibility,
                }
            } catch (err) {
                console.error(`Erro ao buscar metadata para ${file.Key}:`, err.message)

                return {
                    key: file.Key,
                    lastModified: file.LastModified,
                    size: file.Size,
                    storageClass: file.StorageClass,
                    userId: null,
                    visibility: 'private',
                }
            }
        }))

        res.status(200).json({ items })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar itens do S3', error: error.message })
    }
})

router.get('/projects', verifyToken, async (req, res) => {
    try {
        const projects = await Project.find().populate('user', 'name email')

        res.status(200).json({ projects })
    } catch (error) {
        console.error('Erro ao buscar projetos:', error)
        res.status(500).json({ mensagem: 'Erro ao buscar projetos' })
    }
})

module.exports = router
