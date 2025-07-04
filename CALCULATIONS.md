# Aplikasi BakeWise - Rumus Perhitungan

Dokumen ini menguraikan rumus dan logika utama yang digunakan untuk perhitungan di seluruh aplikasi BakeWise.

## 1. Tab Kalkulator Produksi

### 1.1. Hasil Perhitungan

Bagian "Hasil Perhitungan" menampilkan berbagai metrik berdasarkan jumlah produksi yang Anda masukkan.

#### **Metrik Spesifik Produk (misalnya, Total Loyang)**

Untuk produk yang memiliki objek `calculation` yang ditentukan (dikelola di tab "Manajemen Produk"), metrik spesifik dihitung.

- **Rumus:** `(Jumlah Produk / Pembagi) * Pengali`
- **Contoh:** Jika "Abon Sosis" memiliki `divisor` 15 dan `unit` 'loyang', dan Anda memasukkan jumlah 30, hasilnya akan menjadi `(30 / 15) = 2 loyang`.

---

#### **Total Roti**

Ini adalah metrik paling sederhana, yang mewakili jumlah total item individual yang akan diproduksi untuk departemen yang dipilih.

- **Rumus:** `JUMLAH(Semua Jumlah Produk yang Dimasukkan)`
- **Contoh:** Jika Anda memasukkan 30 "Abon Sosis" dan 20 "Cheese Roll", Total Roti akan menjadi `30 + 20 = 50 pcs`.

---

#### **Total Loyang**

Metrik ini mengakumulasi perhitungan "loyang" dari semua produk yang relevan.

- **Rumus:** `JUMLAH(Perhitungan Loyang Produk Individual)`
- **Contoh:** Jika "Abon Sosis" menghasilkan `2 loyang` dan "Hot Sosis" menghasilkan `1 loyang`, Total Loyang akan menjadi `3 loyang`.

---

#### **Kebutuhan Resep Dasar (misalnya, Adonan Roti Manis)**

Aplikasi menghitung berapa banyak takaran resep dasar yang dibutuhkan.

1.  **Hitung Total Adonan yang Dibutuhkan:** Untuk setiap produk yang ditautkan ke resep, aplikasi mengalikan `Jumlah Produk` dengan `Berat Adonan` yang ditentukan dalam pengaturan produk tersebut. Kemudian nilai-nilai ini dijumlahkan.
    - `Total Adonan yang Dibutuhkan = JUMLAH(Jumlah Produk * Berat Adonan per Produk)`
2.  **Hitung Pengali Resep:** Aplikasi membagi `Total Adonan yang Dibutuhkan` dengan `Berat Dasar` dari resep itu sendiri. ( `Berat Dasar` resep bisa berupa nilai manual atau jumlah dari bahan-bahannya sendiri).
    - **Rumus:** `Resep yang Dibutuhkan = Total Adonan yang Dibutuhkan / Berat Dasar Resep`

---

### 1.2. Ringkasan Bahan

Bagian ini menunjukkan jumlah total setiap bahan yang diperlukan untuk seluruh proses produksi.

- **Rumus:** Ringkasan ini adalah agregasi bahan dari dua sumber:
    1.  **Dari Resep Dasar:** Untuk setiap resep dasar yang diperlukan, aplikasi mengambil pengali `Resep yang Dibutuhkan` (dihitung di atas) dan mengalikannya dengan jumlah setiap bahan dalam resep tersebut.
    2.  **Dari Produk (Bahan Tambahan):** Untuk setiap produk yang Anda buat, aplikasi mengambil `Jumlah Produk` yang Anda masukkan dan mengalikannya dengan jumlah setiap "bahan tambahan" yang terdaftar untuk produk tersebut.

Semua bahan yang identik (misalnya, "Tepung" dari tiga resep berbeda) kemudian dijumlahkan menjadi satu total.

---

## 2. Tab Skala Resep

Perhitungan ini sederhana.

- **Rumus:** `Jumlah Skala = Jumlah Bahan Asli * Pengali`
- **Contoh:** Jika resep membutuhkan 100g tepung dan Anda memasukkan pengali `1.5`, jumlah skala akan menjadi `100 * 1.5 = 150g`.

---

## 3. Tab Manajemen Inventaris (Order CUK)

"Order CUK" (Kalkulator Rekomendasi Pesanan) menggunakan data historis untuk memprediksi kebutuhan.

### 3.1. Rata-rata Penggunaan Harian

Ini dihitung untuk hari tertentu dalam seminggu yang Anda pilih untuk prakiraan (misalnya, Senin).

- **Logika:** Aplikasi menemukan **4 catatan penggunaan terakhir yang tersimpan** untuk hari tertentu dalam seminggu tersebut (misalnya, 4 hari Senin terakhir). Kemudian menghitung jumlah rata-rata yang digunakan untuk setiap bahan selama hari-hari tersebut.
- **Rumus:** `Rata-rata Penggunaan = JUMLAH(Jumlah Bahan dari 4 hari relevan terakhir) / 4` (atau dibagi dengan jumlah catatan yang ditemukan, jika kurang dari 4).

### 3.2. Jumlah Pesanan yang Direkomendasikan

Rumus ini menentukan berapa banyak bahan yang perlu Anda pesan untuk memenuhi prakiraan dan mengisi kembali stok Anda ke tingkat aman minimum.

- **Rumus:** `Jumlah yang Harus Dipesan = (Stok Minimum + Rata-rata Penggunaan Harian untuk Hari Prakiraan) - Stok Saat Ini`

- **Catatan:**
    - Jika hasilnya nol atau negatif, itu berarti Anda memiliki cukup stok, dan tidak ada rekomendasi yang ditampilkan untuk item tersebut.
    - Jika suatu bahan memiliki "Unit Pesanan" yang ditentukan (misalnya, memesan "sak" seberat 25.000g), rekomendasi akhir diubah ke unit yang lebih besar tersebut untuk kemudahan.
