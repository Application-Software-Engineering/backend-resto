# Backend API Restoran

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-v5-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/SQLite-v3-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
</p>

API Backend untuk aplikasi restoran yang menyediakan fitur autentikasi pengguna, manajemen menu dengan upload gambar, dan sistem pemesanan. Dibangun menggunakan Node.js, Express, dan SQLite.

## Fitur

- Autentikasi pengguna (register dan login) menggunakan JWT
- Manajemen menu restoran dengan operasi CRUD lengkap
- Upload gambar menu dengan validasi tipe dan ukuran file
- Sistem pemesanan dengan kalkulasi total otomatis
- Middleware authentication untuk proteksi route

## Teknologi yang Digunakan

| Teknologi    | Versi | Fungsi                |
| ------------ | ----- | --------------------- |
| Node.js      | 18+   | JavaScript runtime    |
| Express      | 5.x   | Web framework         |
| SQLite3      | 5.x   | Database              |
| bcrypt       | 6.x   | Password hashing      |
| jsonwebtoken | 9.x   | Autentikasi JWT       |
| Multer       | 2.x   | File upload handler   |
| dotenv       | 16.x  | Environment variables |

## Instalasi

Clone repository dan install dependencies

```bash
git clone https://github.com/Application-Software-Engineering/backend-resto
cd backend
npm install
```

Setup environment variables

```bash
cp .env.example .env
```

Konfigurasi file `.env` sesuai kebutuhan

```env
PORT=3000
JWT_SECRET=your_secret_key_here
DB_PATH=./resto.db
```

Jalankan server

```bash
node index.js
```

Server akan berjalan di `http://localhost:3000`

## Endpoint API

### Authentication

| Method | Endpoint         | Deskripsi                    |
| ------ | ---------------- | ---------------------------- |
| POST   | `/auth/register` | Registrasi pengguna baru     |
| POST   | `/auth/login`    | Login dan dapatkan token JWT |

### Menu

Semua endpoint menu memerlukan header `Authorization: Bearer {token}`

| Method | Endpoint     | Deskripsi                      |
| ------ | ------------ | ------------------------------ |
| GET    | `/menus`     | Ambil semua menu               |
| POST   | `/menus`     | Tambah menu baru dengan gambar |
| PUT    | `/menus/:id` | Update menu dan gambar         |
| DELETE | `/menus/:id` | Hapus menu beserta gambar      |

### Orders

Semua endpoint order memerlukan header `Authorization: Bearer {token}`

| Method | Endpoint  | Deskripsi           |
| ------ | --------- | ------------------- |
| GET    | `/orders` | Ambil semua pesanan |
| POST   | `/orders` | Buat pesanan baru   |

## Contoh Request

### Register

```json
POST /auth/register
Content-Type: application/json

{
  "name": "Nama Pengguna",
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

```json
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Tambah Menu

```json
POST /menus
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "Nasi Goreng",
  "price": 25000,
  "stock": 50,
  "image": "[file]"
}
```

### Buat Pesanan

```json
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    { "menu_id": 1, "qty": 2, "price": 25000 }
  ]
}
```

## Upload Gambar

| Konfigurasi        | Nilai                                            |
| ------------------ | ------------------------------------------------ |
| Maksimal ukuran    | 5MB                                              |
| Format didukung    | JPEG, JPG, PNG, GIF, WEBP                        |
| Lokasi penyimpanan | `uploads/menus/`                                 |
| URL akses          | `http://localhost:3000/uploads/menus/{filename}` |

Gambar akan otomatis dihapus ketika menu dihapus atau diupdate dengan gambar baru.

## Struktur Database

### users
| Kolom    | Tipe    | Keterangan                  |
| -------- | ------- | --------------------------- |
| id       | INTEGER | Primary key, auto increment |
| name     | TEXT    | Nama pengguna               |
| email    | TEXT    | Email unik                  |
| password | TEXT    | Password ter-hash           |

### menus
| Kolom    | Tipe    | Keterangan                  |
| -------- | ------- | --------------------------- |
| id       | INTEGER | Primary key, auto increment |
| name     | TEXT    | Nama menu                   |
| price    | INTEGER | Harga menu                  |
| stock    | INTEGER | Stok tersedia               |
| image    | TEXT    | Path gambar                 |
| owner_id | INTEGER | ID pemilik                  |

### orders
| Kolom      | Tipe    | Keterangan                  |
| ---------- | ------- | --------------------------- |
| id         | INTEGER | Primary key, auto increment |
| user_id    | INTEGER | ID pengguna                 |
| total      | INTEGER | Total harga                 |
| created_at | TEXT    | Waktu pembuatan             |

### order_items
| Kolom    | Tipe    | Keterangan                  |
| -------- | ------- | --------------------------- |
| id       | INTEGER | Primary key, auto increment |
| order_id | INTEGER | ID pesanan                  |
| menu_id  | INTEGER | ID menu                     |
| qty      | INTEGER | Jumlah item                 |
| price    | INTEGER | Harga satuan                |

## Struktur Folder

```
backend/
├── middleware/
│   ├── auth.js          # JWT verification
│   └── upload.js        # Multer configuration
├── routes/
│   ├── auth.js          # Auth endpoints
│   ├── menu.js          # Menu endpoints
│   └── order.js         # Order endpoints
├── uploads/
│   └── menus/           # Uploaded images
├── db.js                # Database initialization
├── index.js             # Application entry point
├── package.json
├── .env.example
└── .gitignore
```

## Testing

Untuk testing API dapat menggunakan:
- Thunder Client (VS Code Extension)
- Postman
- Insomnia
- cURL

Contoh menggunakan cURL:

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Tambah menu dengan gambar
curl -X POST http://localhost:3000/menus \
  -H "Authorization: Bearer {token}" \
  -F "name=Nasi Goreng" \
  -F "price=25000" \
  -F "stock=50" \
  -F "image=@/path/to/image.jpg"
```

## Development Notes

- Database SQLite akan otomatis dibuat saat server pertama kali dijalankan
- Untuk reset database, hapus file `resto.db` dan restart server
- Folder `uploads/menus/` akan otomatis dibuat saat upload pertama kali

## Lisensi

MIT
