#!/bin/bash
# Testing semua endpoint Listing Tracker API
# Jalankan: bash test-endpoints.sh
# Prasyarat: backend jalan di localhost:3000, jq terinstall (opsional, buat pretty-print)

BASE_URL="http://localhost:3000"
COOKIE_FILE="cookies.txt"
EMAIL="tester-$(date +%s)@test.com"  # unique tiap run, hindari 409 duplicate

pp() {
  if command -v jq &> /dev/null; then jq .; else cat; fi
}

section() {
  echo ""
  echo "=================================================="
  echo "$1"
  echo "=================================================="
}

# ─────────────────────────────────────────
section "1. AUTH — Register"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"password123\"}" | pp

section "2. AUTH — Sign In (simpan cookie)"
curl -s -X POST "$BASE_URL/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"password123\"}" \
  -c "$COOKIE_FILE" | pp

section "3. AUTH — Sign In dengan password salah (harus 401)"
curl -s -X POST "$BASE_URL/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"salahpassword\"}" \
  -w "\nStatus: %{http_code}\n"

section "4. AUTH — Register email duplikat (harus 409)"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"password123\"}" \
  -w "\nStatus: %{http_code}\n"

section "5. AUTH — GET /me (dengan cookie, harus berhasil)"
curl -s "$BASE_URL/auth/me" -b "$COOKIE_FILE" | pp

section "6. AUTH — Akses tanpa cookie (harus 401)"
curl -s "$BASE_URL/categories" -w "\nStatus: %{http_code}\n"

section "7. AUTH — Rate limit sign-in (6x percobaan gagal berturut-turut, ke-6 harus 429)"
for i in {1..6}; do
  echo "Percobaan $i:"
  curl -s -o /dev/null -w "Status: %{http_code}\n" -X POST "$BASE_URL/auth/sign-in" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"salah\"}"
done

# ─────────────────────────────────────────
section "8. CATEGORIES — Buat kategori"
CAT1=$(curl -s -X POST "$BASE_URL/categories" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"name":"Manga"}')
echo "$CAT1" | pp
CAT1_ID=$(echo "$CAT1" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

CAT2=$(curl -s -X POST "$BASE_URL/categories" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"name":"Series"}')
echo "$CAT2" | pp
CAT2_ID=$(echo "$CAT2" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

curl -s -X POST "$BASE_URL/categories" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"name":"Movies"}' | pp
CAT3_ID=$(curl -s "$BASE_URL/categories" -b "$COOKIE_FILE" | grep -o '"id":[0-9]*"name":"Movies"' | grep -o '[0-9]*' | head -1)

section "9. CATEGORIES — Duplicate name (harus 409)"
curl -s -X POST "$BASE_URL/categories" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"name":"Manga"}' -w "\nStatus: %{http_code}\n"

section "10. CATEGORIES — List semua"
curl -s "$BASE_URL/categories" -b "$COOKIE_FILE" | pp

section "11. CATEGORIES — Get by ID"
curl -s "$BASE_URL/categories/$CAT1_ID" -b "$COOKIE_FILE" | pp

section "12. CATEGORIES — Get ID yang tidak ada (harus 404)"
curl -s "$BASE_URL/categories/999999" -b "$COOKIE_FILE" -w "\nStatus: %{http_code}\n"

section "13. CATEGORIES — Update (PATCH)"
curl -s -X PATCH "$BASE_URL/categories/$CAT1_ID" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"name":"Manga & Manhwa"}' | pp

# ─────────────────────────────────────────
section "14. ITEMS — Buat item (seed data asli)"
ITEM1=$(curl -s -X POST "$BASE_URL/items" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Kokou no Hito\",\"categoryId\":$CAT1_ID}")
echo "$ITEM1" | pp
ITEM1_ID=$(echo "$ITEM1" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

ITEM2=$(curl -s -X POST "$BASE_URL/items" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Rick and Morty\",\"categoryId\":$CAT2_ID}")
echo "$ITEM2" | pp
ITEM2_ID=$(echo "$ITEM2" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

curl -s -X POST "$BASE_URL/items" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Amadeus\",\"categoryId\":$CAT3_ID}" | pp

section "15. ITEMS — categoryId tidak valid (harus 400)"
curl -s -X POST "$BASE_URL/items" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Item Ngawur","categoryId":999999}' -w "\nStatus: %{http_code}\n"

section "16. ITEMS — Get by ID"
curl -s "$BASE_URL/items/$ITEM1_ID" -b "$COOKIE_FILE" | pp

section "17. ITEMS — Update status (PATCH)"
curl -s -X PATCH "$BASE_URL/items/$ITEM1_ID" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"status":"in_progress"}' | pp

section "18. ITEMS — Update status invalid (harus 422)"
curl -s -X PATCH "$BASE_URL/items/$ITEM1_ID" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"status":"ngasal"}' -w "\nStatus: %{http_code}\n"

section "19. ITEMS — List item per kategori"
curl -s "$BASE_URL/categories/$CAT1_ID/items" -b "$COOKIE_FILE" | pp

section "20. ITEMS — Search by title"
curl -s "$BASE_URL/categories/$CAT1_ID/items?search=kokou" -b "$COOKIE_FILE" | pp

section "21. ITEMS — Filter by status"
curl -s "$BASE_URL/categories/$CAT1_ID/items?status=in_progress" -b "$COOKIE_FILE" | pp

section "22. ITEMS — Kombinasi search + status"
curl -s "$BASE_URL/categories/$CAT1_ID/items?search=kokou&status=in_progress" -b "$COOKIE_FILE" | pp

# ─────────────────────────────────────────
section "23. TAGS — Buat tag"
TAG1=$(curl -s -X POST "$BASE_URL/tags" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"name":"Favorite"}')
echo "$TAG1" | pp
TAG1_ID=$(echo "$TAG1" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

TAG2=$(curl -s -X POST "$BASE_URL/tags" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"name":"Rewatch"}')
echo "$TAG2" | pp
TAG2_ID=$(echo "$TAG2" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')

section "24. TAGS — Duplicate name (harus 409)"
curl -s -X POST "$BASE_URL/tags" -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" -d '{"name":"Favorite"}' -w "\nStatus: %{http_code}\n"

section "25. TAGS — List semua"
curl -s "$BASE_URL/tags" -b "$COOKIE_FILE" | pp

section "26. ITEM-TAGS — Attach tag ke item"
curl -s -X POST "$BASE_URL/items/$ITEM1_ID/tags/$TAG1_ID" -b "$COOKIE_FILE" | pp
curl -s -X POST "$BASE_URL/items/$ITEM1_ID/tags/$TAG2_ID" -b "$COOKIE_FILE" | pp

section "27. ITEM-TAGS — Attach tag yang sama lagi (harus tetap aman, onConflictDoNothing)"
curl -s -X POST "$BASE_URL/items/$ITEM1_ID/tags/$TAG1_ID" -b "$COOKIE_FILE" | pp

section "28. ITEM-TAGS — Get tags milik item"
curl -s "$BASE_URL/items/$ITEM1_ID/tags" -b "$COOKIE_FILE" | pp

section "29. ITEM-TAGS — Detach tag"
curl -s -X DELETE "$BASE_URL/items/$ITEM1_ID/tags/$TAG1_ID" -b "$COOKIE_FILE" | pp

section "30. TAGS — Delete tag"
curl -s -X DELETE "$BASE_URL/tags/$TAG2_ID" -b "$COOKIE_FILE" | pp

# ─────────────────────────────────────────
section "31. DELETE — Hapus item"
curl -s -X DELETE "$BASE_URL/items/$ITEM2_ID" -b "$COOKIE_FILE" | pp

section "32. DELETE — Hapus item ID tidak ada (harus 404)"
curl -s -X DELETE "$BASE_URL/items/999999" -b "$COOKIE_FILE" -w "\nStatus: %{http_code}\n"

section "33. DELETE — Hapus kategori (cascade: item di dalamnya ikut terhapus)"
curl -s -X DELETE "$BASE_URL/categories/$CAT2_ID" -b "$COOKIE_FILE" | pp

section "34. DELETE — Verifikasi cascade (kategori sudah hilang)"
curl -s "$BASE_URL/categories/$CAT2_ID" -b "$COOKIE_FILE" -w "\nStatus: %{http_code}\n"

# ─────────────────────────────────────────
section "35. AUTH — Sign Out"
curl -s -X POST "$BASE_URL/auth/sign-out" -b "$COOKIE_FILE" | pp

section "36. AUTH — Akses setelah sign out (harus 401)"
curl -s "$BASE_URL/categories" -b "$COOKIE_FILE" -w "\nStatus: %{http_code}\n"

# ─────────────────────────────────────────
echo ""
echo "=================================================="
echo "SELESAI. Cek output di atas — bandingkan status code"
echo "dengan yang disebutkan di tiap section title."
echo "=================================================="

rm -f "$COOKIE_FILE"