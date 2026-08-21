# Design System — Listing Tracker

Panduan visual untuk agent coding. Tujuan: semua halaman/komponen yang di-generate terasa satu keluarga, bukan ditempel-tempel dari style berbeda-beda.

## Brand Feel

Aplikasi tracking media personal — kesan yang diinginkan: **bersih, tenang, sedikit playful** (bukan enterprise/corporate, bukan juga terlalu ramai/gamified). Referensi mood: campuran antara Notion (clean, whitespace lega) dan Trakt/Letterboxd (ada sentuhan warna buat status/kategori, tapi tetap minimalis).

## Warna

Base: Tailwind default palette, tidak perlu custom color config kecuali disebutkan di bawah.

| Peran | Warna | Kelas Tailwind |
|---|---|---|
| Background utama | Putih | `bg-white` |
| Background sekunder (card, hover) | Abu sangat terang | `bg-gray-100` |
| Teks utama | Abu gelap | `text-gray-900` |
| Teks sekunder | Abu medium | `text-gray-500` |
| Aksi primer (tombol submit, link) | Biru | `bg-blue-500` / `text-blue-500` |
| Aksi destruktif (delete) | Merah | `text-red-500` / `bg-red-500` |
| Aksen tag/fitur khusus | Ungu | `bg-purple-500` |

### Status Item (Konsisten di Semua Tempat)

| Status | Background | Teks |
|---|---|---|
| `planning` | `bg-gray-200` | `text-gray-700` |
| `in_progress` | `bg-blue-200` | `text-blue-700` |
| `completed` | `bg-green-200` | `text-green-700` |
| `dropped` | `bg-red-200` | `text-red-700` |

Jangan pakai warna lain untuk status di luar tabel ini — kalau nambah status baru di masa depan, tambahkan barisnya di sini dulu sebelum implementasi.

## Tipografi

- Font: default system font stack Tailwind (`font-sans`), tidak perlu import Google Fonts.
- Judul halaman (`h1`): `text-2xl font-bold`
- Judul section: `text-lg font-semibold`
- Body text: default (`text-base`), tanpa class tambahan
- Teks kecil/meta (timestamp, label): `text-sm text-gray-500` atau `text-xs` untuk badge/pill

## Spacing & Layout

- Container halaman: `max-w-xl mx-auto` (list/detail), `max-w-sm mx-auto` (form login/register)
- Padding halaman: `p-4 sm:p-8` (mobile-first, lebih lega di desktop)
- Jarak antar elemen list: `space-y-2`
- Card/row: `p-3 rounded` dengan background `bg-gray-100`, hover `hover:bg-gray-200 transition`

## UI Library

Pakai **shadcn/ui** — bukan npm dependency biasa, tapi CLI yang generate source code komponen langsung ke project (`src/components/ui/`), dibangun di atas Radix UI (headless, accessible) + Tailwind. Ini dipilih karena:
- Tetap konsisten dengan Tailwind yang sudah dipakai backend-facing conventions kamu — bukan sistem styling terpisah kayak MUI/Chakra
- Kamu **punya** source code tiap komponen di project sendiri, bisa diedit bebas — bukan black-box dari `node_modules`
- Aksesibilitas (keyboard nav, ARIA) sudah di-handle Radix di baliknya, tidak perlu dipikirkan manual

### Setup

```bash
bunx shadcn@latest init
```

Pilih base color **neutral** atau **slate** saat inisialisasi — sejalan dengan palet abu-abu yang sudah didefinisikan di bawah.

### Komponen yang Dipakai

Install sesuai kebutuhan, jangan install semua sekaligus:

```bash
bunx shadcn@latest add button input select dialog card badge skeleton
```

| Kebutuhan di App | Komponen shadcn |
|---|---|
| Tombol aksi (submit, delete, dll) | `button` |
| Input teks (form kategori/item/tag, search) | `input` |
| Dropdown status item | `select` |
| Modal konfirmasi delete | `dialog` |
| Card kategori/item | `card` |
| Badge status & tag pill | `badge` |
| Loading placeholder | `skeleton` |

### Aturan Pemakaian

- Import dari `@/components/ui/*`, jangan modifikasi file di folder ini kecuali untuk menyesuaikan warna/varian sesuai tabel warna di bawah.
- Kalau butuh varian warna khusus (misal badge status per-enum), buat wrapper component sendiri di `src/components/` yang membungkus `Badge` dari shadcn, jangan edit `ui/badge.tsx` langsung.
- Confirm dialog (`ConfirmDialog`) dibangun di atas `Dialog` dari shadcn, bukan custom overlay manual.

## Komponen — Aturan Bentuk (Kustomisasi shadcn)

## Interaksi

- Transisi warna pakai `transition` class polos (tanpa durasi custom) — cukup untuk hover state, jangan animasi berlebihan.
- Loading state: skeleton dengan `animate-pulse` + `bg-gray-200`, BUKAN spinner.
- Konfirmasi destruktif: selalu modal (`ConfirmDialog`), tidak pernah `window.confirm()` browser native.

## Yang Dihindari

- Jangan install UI library lain di luar shadcn/ui (tidak perlu MUI, Chakra, Ant Design, dll — akan konflik desain dan menambah bundle size tanpa perlu).
- Jangan pakai warna di luar palette Tailwind default (no custom hex kecuali benar-benar diperlukan) — override lewat `tailwind.config` shadcn kalau perlu konsistensi warna brand, bukan inline hex.
- Jangan bikin border-radius besar (`rounded-2xl`/`rounded-3xl`) — style aplikasi ini `rounded`/`rounded-lg` saja, sejalan dengan default radius shadcn (`--radius` di config, tidak perlu diubah kecuali ada alasan kuat).
- Jangan pakai drop shadow berlebihan (`shadow-xl`, `shadow-2xl`) — komponen `Card` shadcn sudah punya shadow default yang cukup, tidak perlu ditambah.
