# Kas Digital - Pencatat Uang Masuk/Keluar

Aplikasi Kas Digital berbasis PWA yang ringan, bisa diakses offline, dan diinstal di perangkat Android ARMv7a & ARMv8a.

## 1. Alur Kerja Aplikasi
1. Pengguna menambahkan transaksi (pemasukan/pengeluaran)
2. Data disimpan di LocalStorage perangkat
3. Aplikasi bisa diakses offline (service worker)
4. Dapat diekspor ke PDF dan JSON
5. Data dapat dicadangkan/import via JSON file
6. Dapat diinstal sebagai aplikasi di Android (ARMv7a/ARMv8a)

## 2. Struktur Folder
```
Kas Digital/
├── index.html              # Halaman utama aplikasi
├── styles.css             # Desain UI
├── app.js                # Logika aplikasi
├── manifest.json         # Konfigurasi PWA
├── service-worker.js     # Service Worker untuk offline
├── README.md             # Dokumentasi
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Actions untuk auto deploy
```

## 3. Fitur Utama
- ✅ **PWA (Offline & Instalable)**: Akses tanpa internet dan instal di Android ARMv7a/ARMv8a
- ✅ **Local Storage**: Data aman di perangkat Anda
- ✅ **Ekspor PDF & JSON**: Cetak laporan dan backup data
- ✅ **Import JSON**: Pulihkan data dari file backup
- ✅ **Konfigurasi Sync**: Panel untuk setup GitHub PAT dan repo
- ✅ **Responsive Design**: Cocok untuk semua ukuran layar
- ✅ **Clean & Modern UI**: Desain sederhana dan mudah digunakan
- ✅ **GitHub Auto Deploy**: Workflow untuk otomatis update ke GitHub Pages

## 4. Panduan Setup

### 4.1 Hosting di GitHub Pages
1. Buat repository GitHub baru (nama repo bisa apa saja)
2. Push semua file ke repository (branch main)
3. Aktifkan GitHub Pages:
   - Buka Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (dibuat otomatis oleh workflow)
4. Setiap push ke main branch, workflow akan otomatis deploy!

### 4.2 Cara Menggunakan Aplikasi
1. Buka link GitHub Pages Anda di browser Chrome (Android)
2. Akan muncul prompt "Add to Home Screen" - klik untuk install
3. Aplikasi akan muncul di home screen dan bisa dibuka tanpa internet!

### 4.3 Backup & Restore Data
- **Backup**: Klik "Export Data JSON" di tab Laporan
- **Restore**: Klik "Import Data JSON" dan pilih file backup Anda
- **PDF**: Klik "Ekspor ke PDF" untuk mencetak laporan

### 4.4 Konfigurasi Google Drive (Opsional)
Untuk fitur cadangan ke Google Drive (butuh pengembangan lebih lanjut):
1. Buat project di [Google Cloud Console](https://console.cloud.google.com/)
2. Aktifkan **Google Drive API**
3. Buat **OAuth 2.0 Client ID** (Web Application)
4. Tambahkan origin GitHub Pages ke Authorized JavaScript origins
5. Implementasikan OAuth 2.0 flow di `app.js`

### 4.5 Konfigurasi GitHub Sync (Opsional)
Untuk sinkronisasi manual via GitHub API:
1. Buat Personal Access Token (PAT) di GitHub Settings > Developer settings
2. Masukkan PAT dan nama repo (username/repo) di panel Konfigurasi Sinkronisasi
3. Simpan konfigurasi

## 5. Catatan Penting
- Semua kode diberi komentar dengan batas `#` untuk memudahkan pemahaman
- Data disimpan secara lokal di perangkat, selalu rutin backup!
- Aplikasi works di semua browser modern, terbaik di Chrome untuk instalasi PWA

## File yang Dibuat
- `index.html`: Struktur halaman
- `styles.css`: Desain dan styling
- `app.js`: Logika inti dan fitur
- `manifest.json`: Konfigurasi PWA
- `service-worker.js`: Offline support
- `.github/workflows/deploy.yml`: Auto deploy ke GitHub Pages
