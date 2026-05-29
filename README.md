# Kas Digital by Evaga (Rouf) - Versi 0.2

Aplikasi pencatat keuangan digital dengan tampilan seperti e-wallet (DANA, GoPay, OVO).

## Fitur Utama
- ✅ **Tampilan Modern**: Mirip dengan aplikasi e-wallet populer
- ✅ **PWA (Offline & Instalable)**: Bisa diinstal di Android dan diakses tanpa internet
- ✅ **Local Storage**: Data aman di perangkat Anda
- ✅ **Spreadsheet View**: Lihat transaksi dalam format tabel
- ✅ **Ekspor PDF & Excel**: Laporan dengan desain profesional
- ✅ **Backup & Restore**: Simpan dan pulihkan data via JSON
- ✅ **Splash Screen**: Animasi loading dengan branding

## Cara Instal di Android (Menjadi Aplikasi)
1. Buka link GitHub Pages Anda di browser **Chrome** (Android)
2. Tunggu hingga halaman dimuat sepenuhnya
3. Klik tombol **"Add to Home Screen"** atau **"Instal Aplikasi"** yang muncul
4. Aplikasi akan muncul di layar utama dan bisa dibuka tanpa browser!

## Cara Menggunakan di PC/Laptop
Cukup buka link GitHub Pages di browser favorit Anda (Chrome, Firefox, Edge, dll.).

## Cara Kerja Sinkronisasi
- **GitHub**: Semua konfigurasi sudah diatur di GitHub Actions, tidak perlu setup manual
- **Google Drive**: Fitur sedang dalam pengembangan, untuk saat ini gunakan Export JSON untuk mencadangkan data

## Struktur File
```
Kas Digital/
├── index.html          # Halaman utama
├── styles.css          # Desain UI
├── app.js              # Logika aplikasi
├── manifest.json       # Konfigurasi PWA
├── service-worker.js   # Service Worker untuk offline
├── README.md           # Dokumentasi ini
└── .github/
    └── workflows/
        └── deploy.yml  # Auto deploy ke GitHub Pages
```

## Lisensi
Kas Digital by Evaga (Rouf)
