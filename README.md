# Kas Digital by Evaga (Rouf) - v0.4

Aplikasi pencatat keuangan digital modern dengan tampilan seperti e-wallet (DANA, GoPay, OVO).

## 🚀 Fitur Utama v0.4

- ✅ **Onboarding Screen**: Pengguna baru diminta mengisi nama dan tanggal lahir
- ✅ **Profil Pengguna**: Tampilkan nama dan foto profil (dari Google Sign-In)
- ✅ **Google Sign-In**: Login dengan akun Google Anda
- ✅ **Bottom Navigation**: Menu navigasi mengambang dengan animasi
- ✅ **Spreadsheet View**: Lihat transaksi dalam format tabel
- ✅ **Laporan Profesional**: Export ke PDF dan Excel dengan desain menarik
- ✅ **Auto Save Cookies**: Data profil dan transaksi disimpan otomatis
- ✅ **Update Checker**: Cek pembaruan otomatis dari GitHub Releases
- ✅ **Windows 11 Style**: Splash screen dengan animasi seperti Windows 11
- ✅ **Responsive Design**: Tampilan optimal di HP dan PC
- ✅ **Full Screen Mode**: Aplikasi berjalan full screen di kedua perangkat
- ✅ **PWA Support**: Install sebagai aplikasi di HP Android
- 🚧 **Google Drive Sync**: Dalam pengembangan
- 🚧 **GitHub Automation**: Dalam pengembangan

## 📱 Cara Install di Android (Menjadi Aplikasi)

1. Buka link GitHub Pages Anda di browser **Chrome** (Android)
2. Tunggu sampai halaman dimuat sepenuhnya
3. Klik tombol **"Add to Home Screen"** atau **"Install App"** yang muncul
4. Aplikasi akan muncul di layar utama dan bisa dibuka tanpa browser!

## 💻 Cara Menggunakan di PC/Laptop

Cukup buka link GitHub Pages di browser favorit Anda (Chrome, Firefox, Edge, dll.).

## 🛠️ Cara Setup Google Cloud (Untuk Google Sign-In)

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan **Google Drive API** di menu "APIs & Services" > "Library"
4. Buka menu "Credentials" > "Create Credentials" > "OAuth client ID"
5. Pilih "Web application"
6. Tambahkan **Authorized JavaScript origins**:
   - Untuk development: `http://localhost:8000` (atau port lain yang Anda gunakan)
   - Untuk production: `https://swevaga.github.io` (sesuaikan dengan GitHub Pages Anda)
7. Klik "Create" dan simpan Client ID Anda
8. Client ID sudah terpasang di kode (ganti jika perlu di `index.html`)

## 📦 Cara Export & Import Data

### Export Data
1. Buka tab **"Laporan"**
2. Pilih format yang diinginkan (PDF/Excel/JSON)
3. File akan otomatis di-download

### Import Data
1. Buka tab **"Laporan"**
2. Klik **"Restore JSON"**
3. Pilih file JSON yang ingin di-import
4. Data akan otomatis dimuat

## 📱 Cara Build Aplikasi Android (Dengan Capacitor)

### Prasyarat
- Node.js & npm
- Android Studio

### Langkah-langkah
1. Inisialisasi project npm:
```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
```

2. Inisialisasi Capacitor:
```bash
npx cap init "Kas Digital" com.kasdigital.app
```

3. Edit `capacitor.config.json`:
```json
{
  "appId": "com.kasdigital.app",
  "appName": "Kas Digital",
  "webDir": "./"
}
```

4. Tambahkan platform Android:
```bash
npx cap add android
```

5. Copy file ke Android:
```bash
npx cap sync
```

6. Buka project di Android Studio:
```bash
npx cap open android
```

7. Build APK/AAB di Android Studio

## 🚀 Cara Deploy ke GitHub Pages

1. Push semua file ke repository GitHub
2. Buka **Settings** > **Pages**
3. Pilih branch `main` dan folder root
4. Klik **Save**
5. Aplikasi akan live di `https://swevaga.github.io/Kas-Digital/`

## 📝 Catatan Penting

- Semua data disimpan secara lokal di browser Anda
- Gunakan fitur Export JSON untuk mencadangkan data secara teratur
- Google Drive Sync sedang dalam pengembangan

## 📄 Lisensi

Kas Digital by Evaga (Rouf)
