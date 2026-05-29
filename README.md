# Kas Digital by Evaga (Rouf) - Versi 0.3 Beta

Aplikasi pencatat keuangan digital dengan tampilan seperti e-wallet (DANA, GoPay, OVO).

## Fitur Utama v0.3 Beta
- ✅ **Onboarding**: Pengguna diminta mengisi nama dan tanggal lahir saat pertama kali masuk
- ✅ **Profil Pengguna**: Nama dan avatar di header aplikasi
- ✅ **Bottom Navigation**: Menu navigasi mengambang di bawah dengan animasi
- ✅ **Spreadsheet View**: Lihat transaksi dalam format tabel
- ✅ **Settings Modal**: Ubah profil dan lihat panduan setup
- ✅ **Responsive Design**: Tampilan berbeda untuk PC dan Android
- ✅ **Full Screen**: Aplikasi berjalan full screen di kedua perangkat
- ✅ **Logo Kustom**: Gambar uang di tengah lingkaran sebagai logo
- ✅ **Panduan Setup Google Drive & GitHub**: Di halaman settings

## Cara Instal di Android (Menjadi Aplikasi)
1. Buka link GitHub Pages Anda di browser **Chrome** (Android)
2. Tunggu sampai halaman dimuat sepenuhnya
3. Klik tombol **"Add to Home Screen"** atau **"Instal Aplikasi"** yang muncul
4. Aplikasi akan muncul di layar utama dan bisa dibuka tanpa browser!

## Cara Menggunakan di PC/Laptop
Cukup buka link GitHub Pages di browser favorit Anda (Chrome, Firefox, Edge, dll.).

## Panduan Setup Google Drive
Untuk menyinkronkan data dengan Google Drive:
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru
3. Aktifkan Google Drive API
4. Buat OAuth 2.0 Client ID (Web Application)
5. Tambahkan origin URL Anda (misal: `https://username.github.io`) ke **Authorized JavaScript origins**
6. Simpan dan gunakan!

## Panduan Setup GitHub
Untuk deployment otomatis via GitHub Pages:
1. Push semua kode ke repository GitHub Anda
2. Pastikan GitHub Actions workflow sudah ada di `.github/workflows/deploy.yml`
3. Aktifkan GitHub Pages di Settings > Pages
4. Setiap push ke branch `main`, aplikasi akan otomatis di-deploy!

## Struktur File
```
Kas Digital/
├── index.html              # Halaman utama
├── styles.css              # Desain UI
├── app.js                  # Logika aplikasi
├── manifest.json           # Konfigurasi PWA
├── service-worker.js       # Service Worker untuk offline
├── README.md               # Dokumentasi ini
└── .github/
    └── workflows/
        └── deploy.yml      # Auto deploy ke GitHub Pages
```

## Lisensi
Kas Digital by Evaga (Rouf)
