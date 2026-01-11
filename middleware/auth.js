const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET || "SECRET_RESTO"

module.exports = (req, res, next) => {
    const header = req.headers.authorization
    if (!header) return res.status(401).json({ message: "Token wajib" })

    const token = header.split(" ")[1]

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalid" })
        req.user = user
        next()
    })
}