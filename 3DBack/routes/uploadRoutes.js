const express = require('express')
const { upload } = require('../config/s3Config')
const Project = require('../models/Project')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()

const validateFileType = (file, allowedTypes) => {
    const extension = file.originalname.split('.').pop().toLowerCase()
    return allowedTypes.includes(extension)
}

router.post('/upload', verifyToken, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'file3D', maxCount: 1 }]), async (req, res) => {

    if (!req.files || !req.files.coverImage || !req.files.file3D) {
        return res.status(400).json({ mensagem: 'Nenhum arquivo enviado.' })
    }

    if (!validateFileType(req.files.coverImage[0], ['jpg', 'jpeg', 'png', 'gif'])) {
        return res.status(400).json({ mensagem: 'coverImage deve ser uma imagem (jpg, jpeg, png, gif).' })
    }

    if (!validateFileType(req.files.file3D[0], ['stl', 'obj', 'fbx', 'dae', '3ds', 'glb'])) {
        return res.status(400).json({ mensagem: 'file3D deve ser um arquivo 3D (stl, obj, fbx, dae, 3ds, glb).' })
    }

    try {
        const project = new Project({
            id: req.files.coverImage[0].key,
            user: req.user._id,
            projectName: req.body.projectName,
            projectRepresentative: req.body.projectRepresentative,
            description: req.body.description,
            coverImage: req.files.coverImage[0].location,
            filePath: req.files.file3D[0].location,
            projectDate: new Date()
        });

        await project.save();
        res.status(201).json({ mensagem: 'Arquivo enviado com sucesso', project });
    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(408).json({ mensagem: 'Operação abortada. Tente novamente mais tarde.' });
        }
        res.status(500).json({ mensagem: 'Erro ao salvar informações do projeto', error: error.message });
    }
})

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find()
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar projetos', error: error.message })
    }
})

router.get('/projects/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    try {
        const project = await Project.findById(id)
        if (!project) {
            return res.status(404).json({ mensagem: 'Projeto não encontrado' })
        }
        res.status(200).json(project)
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar o projeto', error: error.message })
    }
})

router.get('/projects/user', verifyToken, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id })
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar projetos do usuário', error: error.message })
    }
})

module.exports = router
