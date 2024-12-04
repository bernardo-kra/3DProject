const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String },
    profileImage: { type: String }
})

module.exports = mongoose.model('User', userSchema)
