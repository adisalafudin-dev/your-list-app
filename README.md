<div align="center">

# 📋 Listing Tracker

Aplikasi web untuk membuat kategori/niche kustom (Anime, Movies, Series, Manga, dll) dan melacak item media di dalamnya — lengkap dengan status progres, pencarian, dan filter.

<br />

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![ElysiaJS](https://img.shields.io/badge/ElysiaJS-8B5CF6?style=for-the-badge&logo=elysia&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

</div>

---

## ✨ Fitur

- 🗂️ **Kategori/Niche kustom** — buat kategori bebas sesuai kebutuhan (Anime, Movies, Series, Manga, Game to Play, Food Recipe, dll)
- 📌 **Manajemen item** — tambah, ubah, dan hapus item di dalam tiap kategori
- 🔄 **Status tracking** — tandai progres tiap item (`Planning`, `In Progress`, `Completed`, `Dropped`)
- 🔍 **Search & filter** — cari item berdasarkan judul, filter berdasarkan status, dengan debounce di sisi frontend
- 🔐 **Autentikasi** — sistem register/sign-in berbasis session cookie, data terisolasi per user
- ⚡ **Full type-safety** — validasi & tipe TypeScript dari satu sumber kebenaran (Elysia + Drizzle schema)

---

## 🛠️ Tech Stack

| Layer             | Teknologi                                                                      |
| ----------------- | ------------------------------------------------------------------------------ |
| **Runtime**       | [Bun](https://bun.sh)                                                          |
| **Backend**       | [ElysiaJS](https://elysiajs.com) (TypeScript)                                  |
| **Database**      | [PostgreSQL](https://www.postgresql.org)                                       |
| **ORM**           | [Drizzle ORM](https://orm.drizzle.team)                                        |
| **Frontend**      | [React](https://react.dev) ([Vite](https://vite.dev))                          |
| **Styling**       | [Tailwind CSS](https://tailwindcss.com)                                        |
| **Data Fetching** | [Axios](https://axios-http.com) + [TanStack Query](https://tanstack.com/query) |
| **Routing**       | [React Router](https://reactrouter.com)                                        |

---

## 📂 Struktur Proyek

```
listing-tracker/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts        # koneksi database (Drizzle + postgres.js)
│   │   │   └── schema.ts       # skema tabel (users, categories, items)
│   │   ├── modules/
│   │   │   ├── auth/           # register, sign-in, sign-out, guard
│   │   │   ├── category/       # CRUD kategori
│   │   │   └── item/           # CRUD item, search & filter
│   │   └── index.ts            # entry point
│   └── drizzle.config.ts
│
└── frontend/
    ├── src/
    │   ├── components/         # UI reusable (Card, Form, Skeleton, Dialog, dll)
    │   ├── hooks/               # useCategories, useItems, useAuth, useDebounce, dll
    │   ├── lib/                 # axios instance & fungsi pemanggil API
    │   ├── pages/                # halaman (List, Detail, Login, Register)
    │   └── types/                # tipe TypeScript bersama
    └── vite.config.ts
```

---

## 🚀 Getting Started

### Prasyarat

- [Bun](https://bun.sh) `>= 1.0`
- [PostgreSQL](https://www.postgresql.org) (lokal atau via Docker)

### 1. Clone Repository

```bash
git clone <repo-url>
cd listing-tracker
```

### 2. Setup Backend

```bash
cd backend
bun install
```

Buat file `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/listing_tracker
```

Jalankan PostgreSQL via Docker (opsional, kalau belum ada instance lokal):

```bash
docker run --name listing-tracker-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=listing_tracker \
  -p 5432:5432 \
  -d postgres:16
```

Generate dan terapkan skema database:

```bash
bunx drizzle-kit generate
bunx drizzle-kit push
```

Jalankan server:

```bash
bun dev
```

Backend akan berjalan di `http://localhost:3000`.

### 3. Setup Frontend

Buka terminal baru:

```bash
cd frontend
bun install
bun dev
```

Frontend akan berjalan di `http://localhost:5173` dengan proxy otomatis ke backend (`/api` → `localhost:3000`).

---

## 📡 API Endpoints

### Auth

| Method | Endpoint         | Deskripsi                      |
| ------ | ---------------- | ------------------------------ |
| `POST` | `/auth/register` | Registrasi akun baru           |
| `POST` | `/auth/sign-in`  | Sign in, set session cookie    |
| `POST` | `/auth/sign-out` | Sign out, hapus session cookie |

### Categories

| Method   | Endpoint                | Deskripsi                                                |
| -------- | ----------------------- | -------------------------------------------------------- |
| `GET`    | `/categories`           | List semua kategori milik user                           |
| `GET`    | `/categories/:id`       | Detail satu kategori                                     |
| `POST`   | `/categories`           | Buat kategori baru                                       |
| `PATCH`  | `/categories/:id`       | Ubah kategori                                            |
| `DELETE` | `/categories/:id`       | Hapus kategori (item di dalamnya ikut terhapus)          |
| `GET`    | `/categories/:id/items` | List item dalam kategori, dukung `?search=` & `?status=` |

### Items

| Method   | Endpoint     | Deskripsi                   |
| -------- | ------------ | --------------------------- |
| `GET`    | `/items`     | List semua item             |
| `GET`    | `/items/:id` | Detail satu item            |
| `POST`   | `/items`     | Buat item baru              |
| `PATCH`  | `/items/:id` | Ubah item (termasuk status) |
| `DELETE` | `/items/:id` | Hapus item                  |

> Semua endpoint `categories` dan `items` memerlukan session aktif (`isSignIn` guard).

---

## 🗺️ Roadmap

Lihat [`TODO.md`](./TODO.md) untuk daftar lengkap fitur yang sudah dan belum dikerjakan — termasuk backend backlog dan rencana deploy.

---

## 📄 License

Proyek ini dibuat untuk keperluan pembelajaran/portofolio pribadi.
