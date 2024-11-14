const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { projectName, projectRepresentative, description, visibility } = req.body;

    try {
        const project = await Project.findOne({ id });

        if (!project) {
            return res.status(404).json({ mensagem: 'Projeto não encontrado.' });
        }

        project.projectName = projectName || project.projectName;
        project.projectRepresentative = projectRepresentative || project.projectRepresentative;
        project.description = description || project.description;
        project.visibility = visibility || project.visibility;

        await project.save();

        res.status(200).json({ mensagem: 'Projeto alterado com sucesso.', project });
    } catch (error) {
        console.error('Erro ao alterar projeto:', error);
        res.status(500).json({ mensagem: 'Erro ao alterar o projeto', error: error.message });
    }
});

module.exports = router;
