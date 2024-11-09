const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    id: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectName: String,
    projectRepresentative: String,
    description: String,
    coverImage: String,
    filePath: String,
    projectDate: { type: Date, default: Date.now }
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project
