const express = require('express')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const Project = require('../models/Project')
const s3 = require('../config/s3Config')
const router = express.Router()

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const project = await Project.findOne({ id })

        if (!project) {
            return res.status(404).json({ mensagem: 'Projeto não encontrado.' })
        }

        const deleteFilesPromises = []

        project.coverImageKey.forEach((imageKey) => {
            deleteFilesPromises.push(
                s3.send(new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: imageKey,
                }))
            )
        })

        deleteFilesPromises.push(
            s3.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: project.file3DKey,
            }))
        )

        await Promise.all(deleteFilesPromises)

        await Project.deleteOne({ id })

        res.status(200).json({ mensagem: 'Projeto e arquivos deletados com sucesso.' })
    } catch (error) {
        console.error('Erro ao deletar projeto:', error)
        res.status(500).json({ mensagem: 'Erro ao deletar o projeto', error: error.message })
    }
})

module.exports = router
