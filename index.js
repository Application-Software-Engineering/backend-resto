require("dotenv").config()
const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const authRoutes = require("./routes/auth")
const menuRoutes = require("./routes/menu")
const orderRoutes = require("./routes/order")

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Terlalu banyak request, coba lagi nanti" }
})

const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(express.json())
app.use(limiter)
app.use("/uploads", express.static("uploads"))

app.get("/", (req, res) => {
    res.json({
        message: "🍽️ Welcome to Resto API!",
        version: "1.0.0",
        endpoints: [
            { method: "POST", path: "/auth/register", description: "Register akun baru" },
            { method: "POST", path: "/auth/login", description: "Login user" },
            { method: "GET", path: "/menus", description: "List semua menu" },
            { method: "POST", path: "/menus", description: "Tambah menu baru" },
            { method: "GET", path: "/orders", description: "List semua order" },
            { method: "POST", path: "/orders", description: "Buat order baru" },
        ],
        port: PORT,
    })
})

app.use("/auth", authRoutes)
app.use("/menus", menuRoutes)
app.use("/orders", orderRoutes)

app.listen(PORT, () => console.log(`API running http://localhost:${PORT}`))