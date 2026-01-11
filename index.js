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

const app = express()
app.use(cors())
app.use(express.json())
app.use(limiter)
app.use("/uploads", express.static("uploads"))

app.use("/auth", authRoutes)
app.use("/menus", menuRoutes)
app.use("/orders", orderRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API running http://localhost:${PORT}`))