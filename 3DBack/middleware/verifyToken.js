const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) return res.status(401).json({ mensagem: 'Token não fornecido' })

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
        const user = await User.findById(decoded._id)
        if (!user) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado' })
        }
        req.user = {
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({ mensagem: 'Token inválido' })
    }
}

module.exports = verifyToken
