# Nexora Top Up — Starter Website

Starter project website top up game dengan tampilan dark premium hitam-ungu-putih.

## Menjalankan di komputer
1. Install Node.js versi LTS.
2. Ekstrak ZIP ini.
3. Buka terminal di folder project.
4. Jalankan `npm install`.
5. Jalankan `npm start`.
6. Buka `http://localhost:3000`.

## Fitur yang sudah disiapkan
- Landing page dan katalog game.
- Form pemesanan demo.
- Invoice demo, cetak melalui browser, dan berbagi ke WhatsApp.
- Form booking yang membuka WhatsApp.
- Endpoint download laporan transaksi CSV.
- Halaman admin di `/admin.html` dengan tombol voice calling bahasa Indonesia dan daftar transaksi.
- Profil bisnis online dengan placeholder alamat, telepon, email.
- Endpoint placeholder untuk integrasi API provider.

## Penting: status demo
Project ini belum memproses pembayaran atau top up sungguhan. Invoice demo bukan bukti pembayaran. Jangan menerima pembayaran pelanggan berdasarkan status demo.

## Agar transaksi otomatis aktif
Pilih provider top up dan berikan dokumentasi API resminya. Implementasi backend perlu:
- autentikasi server-to-server dan penyimpanan API secret di environment variables;
- validasi produk, User ID/server ID, harga dan saldo;
- pembuatan transaksi dan idempotency;
- webhook/callback status transaksi yang diverifikasi;
- pemetaan status sukses/gagal/pending;
- pencatatan transaksi dan audit log.

Jangan pernah menaruh API key/provider secret di `public/app.js` atau kode browser.

## Konfigurasi WhatsApp
Edit `STORE_WA` pada `public/app.js`, isi nomor format internasional tanpa `+`, spasi, atau tanda baca, misalnya `62812xxxxxxxx`.

Untuk produksi, gunakan nomor bisnis resmi dan pertimbangkan WhatsApp Business Platform bila memerlukan pesan otomatis.

## Data dan laporan
Starter ini memakai array memori pada server, sehingga data akan hilang saat server restart. Untuk produksi, tambahkan database (misalnya PostgreSQL/MySQL), login admin, otorisasi, backup, dan ekspor CSV dari database.

## Rencana pengembangan berikutnya
- Login admin dengan role admin/CS.
- Database pelanggan, booking, transaksi, produk, dan log.
- UI admin untuk memanggil antrean.
- Integrasi provider top up.
- Integrasi payment gateway dan webhook pembayaran.
- Invoice PDF yang dapat diunduh.
- WhatsApp Business API untuk notifikasi otomatis.
