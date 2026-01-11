require("dotenv").config()
const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const menuRoutes = require("./routes/menu")
const orderRoutes = require("./routes/order")

const app = express()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

app.use("/auth", authRoutes)
app.use("/menus", menuRoutes)
app.use("/orders", orderRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
    console.log(`API running http://localhost:${PORT}`)
)