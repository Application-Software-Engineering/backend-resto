const express = require("express")
const db = require("../db")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, async (req, res) => {
    const { items } = req.body

    try {
        const menuPromises = items.map(item => {
            return new Promise((resolve, reject) => {
                db.get("SELECT * FROM menus WHERE id = ? AND owner_id = ?",
                    [item.menu_id, req.user.id],
                    (err, menu) => {
                        if (err) return reject(err)
                        if (!menu) return reject({ status: 404, message: "Menu tidak ditemukan" })
                        if (menu.stock < item.qty) return reject({ status: 400, message: "Stock tidak cukup" })
                        resolve({ menu, qty: item.qty })
                    }
                )
            })
        })

        const menuItems = await Promise.all(menuPromises)

        const total = menuItems.reduce((sum, { menu, qty }) => sum + (menu.price * qty), 0)

        db.serialize(() => {
            db.run("BEGIN TRANSACTION")

            menuItems.forEach(({ menu, qty }) => {
                db.run("UPDATE menus SET stock = stock - ? WHERE id = ?", [qty, menu.id])
            })

            db.run("INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, ?)",
                [req.user.id, total, new Date().toISOString()],
                function (err) {
                    if (err) {
                        db.run("ROLLBACK")
                        return res.status(500).json({ message: "Gagal membuat pesanan" })
                    }

                    const orderId = this.lastID

                    menuItems.forEach(({ menu, qty }) => {
                        db.run("INSERT INTO order_items (order_id, menu_id, qty, price) VALUES (?, ?, ?, ?)",
                            [orderId, menu.id, qty, menu.price]
                        )
                    })

                    db.run("COMMIT")
                    res.json({ order_id: orderId, total })
                }
            )
        })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Terjadi kesalahan" })
    }
})

router.get("/", auth, (req, res) => {
    db.all(
        "SELECT * FROM orders WHERE user_id = ?",
        [req.user.id],
        (err, rows) => res.json(rows)
    )
})

module.exports = router