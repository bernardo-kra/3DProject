const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    id: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    projectName: String,
    projectRepresentative: String,
    description: String,
    coverImage: [String],
    filePath: String,
    fileName: String,
    coverImageKey: [String],
    file3DKey: String,
    projectDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'archived'], default: 'active' }
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project
