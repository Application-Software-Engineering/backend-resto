const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../db")

const router = express.Router()
const SECRET = process.env.JWT_SECRET || "SECRET_RESTO"

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    const hash = await bcrypt.hash(password, 10)

    db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hash],
        err => {
            if (err) return res.status(400).json({ message: "Email sudah ada" })
            res.json({ message: "Register sukses" })
        }
    )
})

router.post("/login", (req, res) => {
    const { email, password } = req.body

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
            if (!user) return res.status(404).json({ message: "User tidak ditemukan" })

            const valid = await bcrypt.compare(password, user.password)
            if (!valid) return res.status(401).json({ message: "Password salah" })

            const token = jwt.sign(
                { id: user.id, email: user.email },
                SECRET,
                { expiresIn: "1h" }
            )

            res.json({ token })
        }
    )
})

module.exports = router