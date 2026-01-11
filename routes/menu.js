const express = require("express")
const db = require("../db")
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")
const fs = require("fs")
const path = require("path")

const router = express.Router()

router.post("/", auth, upload.single("image"), (req, res) => {
    const { name, price, stock } = req.body
    const image = req.file ? `/uploads/menus/${req.file.filename}` : null

    db.run(
        "INSERT INTO menus (name, price, stock, image, owner_id) VALUES (?, ?, ?, ?, ?)",
        [name, price, stock, image, req.user.id],
        function (err) {
            if (err) return res.status(400).json({ message: "Gagal menambah menu" })
            res.json({
                id: this.lastID,
                name,
                price,
                stock,
                image,
                message: "Menu berhasil ditambahkan"
            })
        }
    )
})

router.get("/", auth, (req, res) => {
    db.all(
        "SELECT * FROM menus WHERE owner_id = ?",
        [req.user.id],
        (err, rows) => {
            if (err) return res.status(500).json({ message: "Gagal mengambil data menu" })
            res.json(rows)
        }
    )
})

router.put("/:id", auth, upload.single("image"), (req, res) => {
    const { name, price, stock } = req.body

    db.get(
        "SELECT * FROM menus WHERE id = ? AND owner_id = ?",
        [req.params.id, req.user.id],
        (err, menu) => {
            if (!menu) return res.status(403).json({ message: "Menu tidak ditemukan atau tidak memiliki akses" })

            let newImage = menu.image
            if (req.file) {
                if (menu.image) {
                    const oldImagePath = path.join(__dirname, "..", menu.image)
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath)
                    }
                }
                newImage = `/uploads/menus/${req.file.filename}`
            }

            db.run(
                `UPDATE menus SET name = ?, price = ?, stock = ?, image = ? WHERE id = ? AND owner_id = ?`,
                [name, price, stock, newImage, req.params.id, req.user.id],
                function (err) {
                    if (err) return res.status(400).json({ message: "Gagal update menu" })
                    if (this.changes === 0) return res.status(403).json({ message: "Tidak ada perubahan" })

                    res.json({
                        message: "Menu berhasil diupdate",
                        data: { id: req.params.id, name, price, stock, image: newImage }
                    })
                }
            )
        }
    )
})

router.delete("/:id", auth, (req, res) => {
    db.get(
        "SELECT * FROM menus WHERE id = ? AND owner_id = ?",
        [req.params.id, req.user.id],
        (err, menu) => {
            if (!menu) return res.status(403).json({ message: "Menu tidak ditemukan atau tidak memiliki akses" })

            if (menu.image) {
                const imagePath = path.join(__dirname, "..", menu.image)
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                }
            }

            db.run(
                "DELETE FROM menus WHERE id = ? AND owner_id = ?",
                [req.params.id, req.user.id],
                function (err) {
                    if (err) return res.status(400).json({ message: "Gagal menghapus menu" })
                    res.json({
                        message: "Menu beserta gambar berhasil dihapus",
                        deleted: this.changes
                    })
                }
            )
        }
    )
})

module.exports = router