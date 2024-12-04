const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    projectId: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectName: { type: String, required: true },
    projectRepresentative: String,
    description: String,
    coverImage: [String],
    filePath: String,
    fileName: String,
    coverImageKey: [String],
    file3DKey: String,
    projectDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    visibility: { type: String, enum: ['public', 'private'], default: 'private' }
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project
