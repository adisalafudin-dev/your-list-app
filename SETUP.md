# Setup Guide — Listing Tracker

> Panduan instalasi dan inisialisasi project **Listing Tracker** menggunakan **Elysia** + **Bun**.

---

## 📋 Prasyarat

Pastikan **Bun** sudah terinstall di sistem kamu:

```bash
bun --version
```

Jika belum terinstall, ikuti petunjuk resmi di: https://bun.sh/docs/installation

---

## 🚀 Phase 1 — Inisialisasi Project

### 1. Membuat Project Baru

Inisialisasi project dengan **Elysia** menggunakan Bun:

```bash
bun create elysia .
```

> **Catatan:** Tanda titik (`.`) di akhir perintah berarti project dibuat di dalam folder/direktori saat ini.

### 2. Install Dependencies

Project ini menggunakan **Drizzle ORM** untuk mengelola database.

Install **Drizzle ORM** (runtime) dan **Drizzle Kit** (dev dependency untuk migrasi):

```bash
bun add drizzle-orm
bun add -d drizzle-kit
```

Install driver postgresql

```bash
bun add drizzle-orm postgres
```

> **Keterangan:**
>
> - `drizzle-orm` — library utama yang dipakai saat aplikasi berjalan (runtime).
> - `drizzle-kit` — alat bantu untuk membuat dan menjalankan migrasi database (hanya dibutuhkan saat development).

---

## 🗂️ Struktur Folder

Setelah project berhasil dibuat, buat struktur folder seperti berikut:

```
/src
├── /db          # Konfigurasi koneksi & schema database
└── /modules     # Modul-modul fitur aplikasi
```

### Penjelasan Struktur

| Folder         | Fungsi                                                        |
| -------------- | ------------------------------------------------------------- |
| `/src/db`      | Menyimpan konfigurasi koneksi database dan definisi schema.   |
| `/src/modules` | Menyimpan modul-modul fitur (rute, service, controller, dll). |

---

## ✅ Ringkasan

Setelah menyelesaikan Phase 1, project kamu sudah siap dengan:

- [x] Project Elysia + Bun terinisialisasi
- [x] Drizzle ORM & Drizzle Kit terinstall
- [x] Struktur folder awal `/src/db` dan `/src/modules` terbentuk

Lanjut ke phase berikutnya untuk pengembangan lebih lanjut. 🎉
