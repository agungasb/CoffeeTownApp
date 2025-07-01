# BUKU PANDUAN APLIKASI COFFEE TOWN BAKERY

## Daftar Isi
1. [Gambaran Umum](#1-gambaran-umum)
2. [Login & Pengaturan](#2-login--pengaturan)
3. [Memilih Departemen](#3-memilih-departemen)
4. [Tab: Kalkulator Produksi](#4-tab-kalkulator-produksi)
5. [Tab: Skala Resep](#5-tab-skala-resep)
6. [Tab: Manajemen Resep](#6-tab-manajemen-resep)
7. [Tab: Manajemen Produk](#7-tab-manajemen-produk)
8. [Tab: Manajemen Inventaris](#8-tab-manajemen-inventaris)
9. [Tab: Riwayat Penggunaan](#9-tab-riwayat-penggunaan)

---

### 1. Gambaran Umum

Aplikasi ini adalah alat bantu yang dirancang khusus untuk Coffee Town Bakery. Tujuannya adalah untuk menyederhanakan dan mempercepat proses perhitungan produksi harian, manajemen resep, inventaris, dan rekomendasi pemesanan bahan baku. Sudah disesuaikan dengan workflow yang ada di Coffee Town Bakery.

---

### 2. Login & Pengaturan

#### Login
Untuk dapat mengubah data (menambah, mengedit, menghapus resep, produk, dan inventaris), Anda harus login terlebih dahulu.
- Klik ikon **gembok masuk (Login)** di pojok kanan atas.
- Masukkan `Username` dan `Password` yang telah diberikan.
- Klik tombol **Login**.
- Untuk keluar, klik ikon **gembok keluar (Logout)**.

---

### 3. Memilih Departemen

Aplikasi ini mendukung beberapa departemen produksi. Semua data di tab **Kalkulator Produksi**, **Manajemen Produk**, **Manajemen Inventaris**, dan **Riwayat Penggunaan** akan disaring berdasarkan departemen yang Anda pilih.

- Gunakan menu dropdown **Department** di bawah baris tombol navigasi utama.
- Pilih departemen yang diinginkan: **Department Roti Manis**, **Department Donut**, atau **Department Roti Sobek**.
- Tampilan data akan otomatis diperbarui sesuai departemen yang dipilih.

---

### 4. Tab: Kalkulator Produksi

Tab ini adalah fitur utama untuk menghitung kebutuhan bahan baku berdasarkan jumlah produksi harian.

#### Cara Menggunakan:
1.  **Pilih Departemen** yang benar.
2.  **Isi Jumlah Produksi**: Masukkan jumlah (dalam pcs) untuk setiap produk yang akan dibuat. Anda bisa melakukannya dengan dua cara:
    *   **Manual**: Ketik langsung jumlah di kolom input di samping nama produk.
    *   **Otomatis (OCR)**:
        *   Siapkan screenshot catatan produksi Anda (yang dikirim Bang Dodi).
        *   Klik tombol **Upload & Map Quantities**.
        *   Pilih file gambar screenshot tersebut.
        *   OCR Genkit akan menganalisis gambar dan mencoba mengisi jumlah secara otomatis. Periksa kembali angka yang diisi OCR Genkit untuk memastikan inputan benar.
3.  **Hitung**: Setelah semua jumlah terisi, klik tombol besar **CALCULATE**.
4.  **Lihat Hasil**:
    *   **Calculation Results**: Bagian ini menampilkan metrik penting seperti total loyang, total roti, dan jumlah resep adonan yang dibutuhkan.
    *   **Ingredient Summary**: Bagian ini menampilkan total semua bahan baku yang dibutuhkan dari semua resep dan topping, sudah diakumulasi.
5.  **Simpan Penggunaan Harian**:
    *   Fitur ini **hanya aktif jika Anda sudah login**.
    *   Setelah menghitung, jika Anda ingin menyimpan ringkasan penggunaan bahan ini sebagai data historis (berguna untuk kalkulator pesanan), klik tombol **Save as Daily Usage**.
    *   Data ini akan muncul di tab **Usage History**.

---

### 5. Tab: Skala Resep

Tab ini berfungsi untuk menghitung ulang bahan-bahan dalam sebuah resep jika Anda ingin membuat adonan dengan skala yang berbeda (misalnya, membuat 1.5 resep atau 0.5 resep).

#### Cara Menggunakan:
1.  **Choose Recipe**: Pilih resep yang ingin Anda skalakan dari menu dropdown.
2.  **Enter Multiplier**: Masukkan faktor pengali. Contoh: `1.5` untuk membuat satu setengah resep.
3.  **Scale Recipe**: Klik tombol ini.
4.  **Hasil**: Di sebelah kanan akan muncul daftar bahan yang sudah dikalikan beserta instruksi cara membuatnya.

---

### 6. Tab: Manajemen Resep

Di sini Anda dapat melihat, menambah, mengedit, dan menghapus semua resep dasar (seperti adonan). **Anda harus login untuk melakukan perubahan.**

- **Melihat Detail**: Klik **View Details** pada kartu resep untuk melihat bahan dan langkah-langkahnya.
- **Menambah Resep Baru**:
    1. Klik **Add New Recipe**.
    2. Isi nama resep, bahan-bahan, dan langkah-langkah pada form yang muncul.
    3. Klik **Save Recipe**.
- **Mengedit Resep**:
    1. Klik **Edit** pada kartu resep yang ingin diubah.
    2. Ubah data pada form yang muncul.
    3. Klik **Save Recipe**.
- **Menghapus Resep**:
    1. Klik **Delete** pada kartu resep yang ingin dihapus.
    2. Konfirmasi penghapusan. **Tindakan ini tidak bisa dibatalkan.**

---

### 7. Tab: Manajemen Produk

Di sini Anda mengelola daftar produk jadi yang dijual. Setiap produk terhubung dengan resep adonan dasar dan bahan-bahan tambahan (topping, filling). **Anda harus login untuk melakukan perubahan.**

- **Melihat Detail**: Klik **View Details** pada kartu produk untuk melihat bahan tambahannya.
- **Menambah Produk Baru**:
    1. Klik **Add New Product**.
    2. Isi nama produk.
    3. **Base Recipes**: Hubungkan produk dengan resep adonan dasarnya dan tentukan berat adonan per pcs.
    4. **Additional Ingredients**: Tambahkan bahan-bahan lain yang spesifik untuk produk ini (misalnya topping ceres, filling keju).
    5. Klik **Save Product**.
- **Mengedit/Menghapus**: Gunakan tombol **Edit** dan **Delete** pada setiap produk.

---

### 8. Tab: Manajemen Inventaris

Tab ini menampilkan status stok semua bahan baku di departemen yang dipilih. **Anda harus login untuk melakukan perubahan.**

#### Fitur Utama:
- **Tabel Stok**: Menampilkan nama bahan, stok saat ini, stok minimum, rata-rata penggunaan harian, dan status (In Stock, Low, Critical).
- **Tambah/Edit/Hapus Bahan**: Gunakan tombol **Add New Ingredient**, **Edit**, dan **Delete** untuk mengelola daftar bahan baku. Saat mengedit, Anda bisa memperbarui jumlah stok saat ini.
- **Order CUK (Kalkulator Rekomendasi Pesanan)**:
    1. Klik tombol **Order CUK**.
    2. **Select Day for Forecast**: Pilih hari yang ingin Anda proyeksikan (misalnya, pilih 'Senin' untuk melihat rekomendasi pesanan untuk produksi hari Senin). Kalkulator akan menggunakan rata-rata pemakaian dari 4 hari Senin terakhir yang datanya tersimpan.
    3. **Enter Current Stock Levels (Optional)**: Anda bisa memasukkan jumlah stok terkini di sini jika berbeda dari data di database. Ini hanya untuk simulasi perhitungan.
    4. Klik **Calculate Recommendation**.
    5. Hasilnya akan menampilkan bahan apa saja yang perlu dipesan beserta jumlahnya.
- **Reset Usage Data**: Tombol ini akan **menghapus semua riwayat penggunaan harian**. Hati-hati menggunakannya karena data ini penting untuk kalkulator pesanan.

---

### 9. Tab: Riwayat Penggunaan

Tab ini berisi arsip dari semua data penggunaan yang telah Anda simpan dari **Kalkulator Produksi**.

- Setiap entri menunjukkan tanggal penyimpanan dan daftar bahan yang digunakan pada hari itu.
- Ini adalah sumber data utama untuk **Kalkulator Rekomendasi Pesanan** di tab Inventaris. Semakin banyak data yang Anda simpan, semakin akurat rekomendasinya.

---

Semoga Bermanfaat, Salam Gacor