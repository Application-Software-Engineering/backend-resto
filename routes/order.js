const express = require("express")
const db = require("../db")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, (req, res) => {
    const { items } = req.body
    let total = 0

    items.forEach(i => total += i.price * i.qty)

    db.run(
        "INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, ?)",
        [req.user.id, total, new Date().toISOString()],
        function () {
            const orderId = this.lastID

            items.forEach(i => {
                db.run(
                    "INSERT INTO order_items (order_id, menu_id, qty, price) VALUES (?, ?, ?, ?)",
                    [orderId, i.menu_id, i.qty, i.price]
                )
            })

            res.json({ order_id: orderId })
        }
    )
})

router.get("/", auth, (req, res) => {
    db.all(
        "SELECT * FROM orders WHERE user_id = ?",
        [req.user.id],
        (err, rows) => res.json(rows)
    )
})

module.exports = router