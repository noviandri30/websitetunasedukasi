# Tunas Edukasi — Website Multi-page

Website prototipe PKBM Tunas Karya Edukasi Indonesia untuk domain https://tunasedukasi.sch.id.

## Halaman
Beranda, Tentang Kami, Program Belajar, Paket A, Paket B, Paket C, Homeschooling, Cara Belajar, Inspirasi, FAQ, dan Kontak.

## Fitur
- Desain joyful responsif dengan warna utama #38a6ea / #0072b2 dan aksen #a92974 / #eee8a9.
- Animasi ringan, hover interaktif, halaman program terpisah, dropdown navigasi dan menu mobile.
- Filter inspirasi, kategori FAQ dan draft formulir konsultasi.
- HTML, CSS, dan JavaScript standar; tidak memerlukan build Node.js atau database.

## Jalankan secara lokal
Buka `index.html` di browser, atau jalankan `python -m http.server 8000` dari root proyek.

## Pengujian
`python scripts/check_site.py` (membutuhkan Node.js untuk validasi sintaks JavaScript).

## Catatan sebelum produksi
- Konten contoh aktivitas bukan jadwal resmi lembaga.
- Biaya, jadwal, syarat pendaftaran, dan kanal komunikasi belum dikonfirmasi.
- Form konsultasi adalah demo untuk membuat draft; belum mengirim pesan.
- Periksa identitas dan data pada sumber resmi: https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/P9957052.
- Review keseluruhan konten, dokumentasi, izin aset, dan lakukan backup sebelum deploy Hostinger.

## Branch
`staging` digunakan untuk review; branch `main` dan deployment produksi tidak diubah otomatis.
