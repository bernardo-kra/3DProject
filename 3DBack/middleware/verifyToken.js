const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ mensagem: 'Access token not provided' })
    jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err)
            return res.status(401).json({ mensagem: 'Invalid access token' })
        }
        req.user = decoded
        next()
    })
}

module.exports = verifyToken
