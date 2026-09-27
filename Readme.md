# Galeri Sertifikat & Kegiatan (Next.js + React + Tailwind)

## Cara menjalankan
```bash
npm install
npm run dev
```
Buka http://localhost:3000

## Cara mengedit data
Edit langsung file `data/certificates.js` — tambah/ubah/hapus item di array.
- `driveId`: ambil dari link Google Drive `.../d/ID_INI/view`. Pastikan sharing diatur
  "Siapa saja yang memiliki link" agar foto tampil.
- `category`: bebas diisi (Seminar, Lomba, Workshop, dst) — filter kategori & statistik
  otomatis mengikuti isi data ini.
- `date`: format `YYYY-MM-DD`, dipakai juga oleh kalender filter tanggal.

## Struktur
- `app/page.js` — halaman utama (state filter, kalender, pencarian, grid)
- `components/CertificateCard.js` — kartu foto di grid
- `components/CertificateModal.js` — modal detail + unduh + salin link
- `components/CalendarFilter.js` — kalender interaktif untuk filter tanggal/bulan/tahun
- `lib/drive.js` — helper konversi link Google Drive
- `data/certificates.js` — data kegiatan/sertifikat

## Catatan
Pencarian hanya mencocokkan **judul** dan **lokasi**. Filter tanggal terpisah lewat
tombol "Filter Tanggal" yang membuka kalender — klik tanggal untuk memfilter persis
hari itu, ganti bulan/tahun lewat dropdown di atas kalender.