# Spec — Frontend Rebuild (Listing Tracker)

Dokumen ini dikonsumsi oleh coding agent (Antigravity) untuk rebuild frontend dari nol. Backend sudah selesai dan tidak berubah — lihat `AGENTS.md` untuk API reference lengkap.

---

## 1. Proposal (What & Why)

### Summary
Rebuild frontend React untuk "Listing Tracker" — aplikasi tracking seperti list sesuatu atau object (anime, resep, tempat yang ingin dikunjungi, game, dll) yang dikelompokkan dalam kategori kustom, dengan status progres, tag lintas-kategori, dan pencarian/filter.

### Why
Frontend versi sebelumnya dibangun bertahap secara manual selama sesi belajar Elysia/Bun — fungsional tapi styling & struktur component seadanya. Rebuild ini bertujuan menghasilkan frontend dengan kualitas visual dan struktur kode yang lebih matang, sambil tetap mengonsumsi API backend yang sudah stabil.

### Scope
- Semua halaman: list kategori, detail kategori (list item + filter + search), login, register
- Semua interaksi CRUD: kategori, item, tag
- Auth flow lengkap: register, login, logout, protected route
- Status tracking (dropdown ubah status item)
- Tag management (attach/detach tag ke item, buat tag baru)
- Search & filter dengan debounce

### Not in Scope
- Backend tidak diubah sama sekali
- Tidak ada fitur baru di luar yang sudah didefinisikan di backend (rating, cover image, dll — belum ada endpoint-nya)
- Tidak perlu dark mode (opsional, boleh diabaikan)
- Tidak perlu i18n/multi-bahasa

### Success Criteria
- [ ] Semua endpoint di `AGENTS.md` API Reference terpakai dan berfungsi dari UI
- [ ] Loading state (skeleton) dan empty state ada di setiap list
- [ ] Aksi delete (kategori/item/tag) selalu lewat dialog konfirmasi
- [ ] Search di halaman detail kategori memakai debounce (jangan fetch tiap keystroke)
- [ ] Halaman kategori & item terlindungi (redirect ke `/login` jika belum auth)
- [ ] Responsive — layak dipakai di viewport mobile (≥375px width)

---

## 2. Design (Technical Design)

### Routes

| Path | Halaman | Protected? |
|---|---|---|
| `/login` | Sign in | Tidak |
| `/register` | Register | Tidak |
| `/` | List semua kategori | Ya |
| `/categories/:id` | Detail kategori — list item, search, filter status, tag picker | Ya |

### Component Map

```
pages/
  LoginPage          — form email+password, link ke /register
  RegisterPage        — form email+password, redirect ke /login setelah sukses
  CategoryListPage    — form buat kategori baru + list kategori (link ke detail, delete)
  CategoryDetailPage  — search bar, filter status, form tambah item, list item

components/
  CategoryForm         — input nama kategori
  CategoryCard/List     — 1 baris kategori, link ke detail + tombol delete
  ItemForm              — input judul item baru
  ItemCard/List          — 1 baris item: judul, dropdown status, tag picker, tombol delete
  ItemTagPicker          — pill toggle untuk tag yang tersedia + input inline buat tag baru
  ConfirmDialog           — modal konfirmasi, dipakai untuk semua aksi delete
  EmptyState               — pesan + deskripsi saat list kosong
  CategorySkeleton/ItemSkeleton — placeholder loading
  ProtectedRoute            — nested route guard, cek `useAuth().isAuthenticated`

hooks/
  useCategories()      — query + mutation CRUD kategori
  useItems(categoryId, filters) — query + mutation CRUD item, termasuk updateStatus
  useTags()             — query + mutation CRUD tag global
  useAuth()             — query ['auth','me'], mutation signIn/register/signOut
  useDebounce(value, delay) — utility generik
  useConfirmDelete(onDelete) — state modal konfirmasi, generik

lib/
  axios.ts   — instance axios (withCredentials, response interceptor 401)
  api.ts     — semua fungsi pemanggil endpoint (mengikuti API Reference di AGENTS.md)

types/
  index.ts   — Category, Item, ItemStatus, Tag, User
```

### Data Flow (Contoh: Update Status Item)

1. User pilih status baru di `<select>` pada `ItemCard`
2. `useItems(categoryId).updateStatus.mutate({ id, status })`
3. Mutation memanggil `api.items.update(id, { status })` → `PATCH /items/:id`
4. `onSuccess` → `invalidateQueries({ queryKey: ['items', categoryId] })`
5. TanStack Query refetch otomatis, UI update

### Non-Functional Requirements
- Semua query key mengikuti pola di `AGENTS.md` (lihat bagian Konvensi Frontend)
- Warna status: `planning` abu-abu, `in_progress` biru, `completed` hijau, `dropped` merah — bebas pilih shade Tailwind, konsisten di semua tempat status ditampilkan
- Tag ditampilkan sebagai pill dengan border, warna aktif (attached) berbeda dari inactive

---

## 3. Tasks (Urutan Implementasi)

1. [ ] Setup project — Vite + React + TS + Tailwind v4 + proxy `/api`
2. [ ] Setup shadcn/ui (`bunx shadcn@latest init`, base color neutral/slate), install komponen awal: `button`, `input`, `select`, `dialog`, `card`, `badge`, `skeleton`
3. [ ] Install dependencies: `axios`, `@tanstack/react-query`, `react-router-dom`
4. [ ] `types/index.ts` — semua tipe sesuai API Reference
5. [ ] `lib/axios.ts` + `lib/api.ts` — implementasi lengkap sesuai API Reference di `AGENTS.md`
6. [ ] Setup `QueryClientProvider` + `BrowserRouter` di `main.tsx`
7. [ ] `useAuth()` — termasuk query `['auth','me']`
8. [ ] `LoginPage`, `RegisterPage`
9. [ ] `ProtectedRoute` + routing di `App.tsx`
10. [ ] `useCategories()`, `CategoryForm`, `CategoryListPage`
11. [ ] `useItems()`, `ItemForm`, `CategoryDetailPage` (tanpa search/filter/tag dulu)
12. [ ] Dropdown status di item card + `updateStatus` mutation
13. [ ] `useDebounce`, search bar + filter status di `CategoryDetailPage`
14. [ ] `useTags()`, `ItemTagPicker` (attach/detach + inline create tag)
15. [ ] `ConfirmDialog` + `useConfirmDelete` — terapkan di semua aksi delete (kategori, item, tag)
16. [ ] `CategorySkeleton`, `ItemSkeleton`, `EmptyState` — pasang di semua list
17. [ ] Responsive pass — cek semua halaman di viewport mobile

---

## Catatan untuk Agent

- Backend berjalan di `localhost:3000`, jangan diubah.
- Ikuti konvensi di `AGENTS.md` secara ketat — terutama pola query key, struktur folder, dan aturan pemakaian shadcn/ui di `design-system.md`.
- Kalau ada endpoint yang perilakunya tidak jelas dari deskripsi di sini, cek `AGENTS.md` API Reference dulu sebelum menebak.
- Setelah selesai satu task, jalankan `bun dev` dan verifikasi manual sebelum lanjut ke task berikutnya.
