# TODO — Listing Tracker

Status saat ini: Backend MVP (Category + Item CRUD) selesai. Frontend pakai axios + TanStack Query (bukan fetch/hook manual) — component breakdown + query layer sudah dikerjakan.

---

## Phase 5B — Component Breakdown + Data Layer (axios + TanStack Query)

```
frontend/src/
├── components/
│   ├── CategoryList.tsx     # render daftar category
│   ├── CategoryCard.tsx     # 1 card category (nama + jumlah item + link)
│   ├── CategoryForm.tsx     # form input nama category baru
│   ├── ItemList.tsx         # render daftar item di 1 category
│   ├── ItemCard.tsx         # 1 card item
│   └── ItemForm.tsx         # form tambah item baru
├── hooks/
│   ├── useCategories.ts     # useQuery + useMutation buat category
│   └── useItems.ts          # useQuery + useMutation buat item, keyed by categoryId
├── lib/
│   ├── axios.ts              # axios instance (baseURL, interceptors request/response)
│   └── api.ts                # fungsi-fungsi pemanggil apiClient per resource
├── types/
│   └── index.ts             # tipe Category, Item (idealnya sinkron sama model backend)
└── App.tsx                  # cuma merakit hook + component, bukan logic
```

- [x] Extract `Category` & `Item` type ke `types/index.ts`
- [x] Bikin `lib/axios.ts` — instance axios + interceptor request/response
- [x] Bikin `lib/api.ts` — fungsi per resource pakai `apiClient`
- [x] Setup `QueryClientProvider` di `main.tsx`
- [x] Extract `useCategories()` pakai `useQuery`/`useMutation` + `invalidateQueries`
- [x] Extract `useItems(categoryId)` — query key `['items', categoryId]`
- [x] Pecah `CategoryList` + `CategoryCard` jadi component terpisah
- [x] Bikin `CategoryForm` — form create category, `App.tsx` cuma merakit
- [ ] Pasang `@tanstack/react-query-devtools` buat debugging cache

## Phase 6 — Routing & Halaman Detail

- [ ] Install `react-router-dom` (atau alternatif seperti `wouter` yang lebih ringan)
- [ ] Halaman `/` — list semua category
- [ ] Halaman `/categories/:id` — detail 1 category + list item di dalamnya (pakai endpoint `GET /categories/:id/items` yang sudah dibuat)
- [ ] `ItemList` + `ItemCard` + `ItemForm` di halaman detail category

## Phase 7 — Backend Polish

- [ ] Global error handling via `onError` — response error konsisten (bukan bocorin raw error)
- [ ] Response envelope konsisten (misal `{ data, error }` di semua endpoint)
- [ ] Validasi tambahan: cegah duplicate category name
- [ ] `PATCH /categories/:id` dan `PATCH /items/:id` — saat ini baru ada create/delete, belum ada update

## Phase 8 — Fitur: Status Tracking

Ide awal dari rules mentorship kita — status per item (Planning/Watching/Completed dsb).

- [ ] Tambah kolom `status` di schema `items` (enum: `planning`, `in_progress`, `completed`, `dropped`)
- [ ] Migration + update `ItemModel`
- [ ] UI: dropdown/badge status di `ItemCard`
- [ ] Filter item berdasarkan status di halaman detail category

## Phase 9 — Search & Filter

- [ ] Search item berdasarkan title (query param `?search=`)
- [ ] Filter kombinasi: category + status
- [ ] Debounce input search di frontend

## Phase 9.5 — Auth (Single/Multi User)

Belum krusial buat MVP personal-use, tapi worth disiapkan kalau nanti mau publikasi/multi-user.

- [ ] Tambah tabel `users` di schema (`id`, `email`, `passwordHash`, `createdAt`)
- [ ] Tambah kolom `userId` (FK) ke tabel `categories` — supaya data terisolasi per user
- [ ] Endpoint `POST /auth/register` — hash password pakai `Bun.password.hash()`
- [ ] Endpoint `POST /auth/sign-in` — verifikasi pakai `Bun.password.verify()`, set session/cookie
- [ ] `AuthService` sebagai Elysia instance + `.macro()` (`isSignIn`) — ikutin pola request-dependent service dari Best Practice yang sudah dipelajari
- [ ] Guard semua route `categories`/`items` dengan `isSignIn: true`
- [ ] Middleware/plugin buat filter query otomatis by `userId` (biar user A nggak bisa lihat data user B)
- [ ] Isi request interceptor di `lib/axios.ts` (sudah disiapkan) — auto-attach token/cookie ke tiap request
- [ ] Isi response interceptor di `lib/axios.ts` (sudah disiapkan) — handle 401 (redirect ke /login / clear auth state)
- [ ] Frontend: halaman login/register
- [ ] Frontend: simpan status auth (context/hook `useAuth`), redirect ke login kalau belum sign in
- [ ] Opsional: JWT vs session cookie — evaluasi mana yang lebih cocok sebelum implementasi

## Phase 10 — UI Polish

- [ ] Loading skeleton (bukan cuma teks "Loading...")
- [ ] Empty state (kategori belum ada item)
- [ ] Konfirmasi sebelum delete (modal/dialog)
- [ ] Dark mode (opsional)
- [ ] Responsive check di mobile

## Ide Fitur Lanjutan (Belum Prioritas)

- [ ] Rating per item (1-5 bintang)
- [ ] Catatan/notes per item (misal alasan drop, review singkat)
- [ ] Cover image per item (upload atau paste URL)
- [ ] Statistik sederhana (total item per kategori, breakdown status)
- [ ] Export data (JSON/CSV)
- [ ] Drag-and-drop reorder item dalam kategori

---

## Catatan Teknis (Reminder buat Diri Sendiri)

- Backend: Bun + ElysiaJS + Drizzle + PostgreSQL
- Frontend: React (Vite) + Tailwind v4 + axios + TanStack Query
- Struktur backend ikutin pattern: `modules/<fitur>/{index.ts, service.ts, model.ts}`
- Dev proxy: Vite `/api` → `localhost:3000` (hindari CORS saat development)
- Seed data untuk testing: Manga "Kokou no Hito", Series "Rick and Morty", Movie "Amadeus"
