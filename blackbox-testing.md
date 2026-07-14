# 🧪 Dokumen Pengujian Black Box (Black Box Testing)

Sistem Pakar Diagnosa Kerusakan Laptop (CertiFix) telah melalui tahap pengujian perangkat lunak menggunakan metode **Black Box Testing**. Pengujian ini berfokus pada fungsionalitas antarmuka sistem tanpa melihat struktur kode internal, guna memastikan bahwa setiap _input_ pengguna menghasilkan _output_ yang sesuai dengan ekspektasi (Spesifikasi Kebutuhan).

---

## 1. Pengujian Modul Pengguna (Pasien / Konsultasi)

| No  | Skenario Pengujian                      | Skenario Input (Tindakan)                                                | Hasil yang Diharapkan                                                                                                             | Status   |
| :-- | :-------------------------------------- | :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :------- |
| 1.1 | Akses Halaman Konsultasi                | Klik tombol "Mulai Konsultasi Gratis" di Beranda.                        | Sistem mengarahkan ke form pendaftaran identitas pengguna.                                                                        | ✅ Valid |
| 1.2 | Input Identitas Valid                   | Mengisi form Nama dengan teks (ex: "Budi") dan menekan "Mulai Diagnosa". | Sistem menyimpan nama secara temporary dan mengarahkan ke halaman pertanyaan kuesioner gejala pertama.                            | ✅ Valid |
| 1.3 | Navigasi Kuesioner (Keyboard Shortcut)  | Menekan tombol "Y" atau panah "Kanan" pada keyboard.                     | Sistem merespons seolah user mengklik tombol "Ya" dan memuat pertanyaan berikutnya (Transisi mulus).                              | ✅ Valid |
| 1.4 | Diagnosa dengan Gejala Sesuai (CF 100%) | Menjawab "Ya" pada 3 pertanyaan gejala pertama.                          | Sistem menavigasi ke halaman Hasil, menampilkan persentase CF 100%, jenis kerusakan, dan saran solusi. Data tersimpan ke riwayat. | ✅ Valid |
| 1.5 | Diagnosa tanpa Gejala (Healthy / 0%)    | Menjawab "Tidak" pada 4 pertanyaan gejala pertama.                       | Sistem menampilkan hasil "Tidak Ditemukan Kerusakan Fatal" dengan CF 0%.                                                          | ✅ Valid |

---

## 2. Pengujian Modul Autentikasi Admin

| No  | Skenario Pengujian             | Skenario Input (Tindakan)                                             | Hasil yang Diharapkan                                                                | Status   |
| :-- | :----------------------------- | :-------------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :------- |
| 2.1 | Login dengan Kredensial Kosong | Membiarkan Email dan Password kosong, lalu klik "Masuk".              | Sistem menampilkan peringatan HTML5 validasi form (required).                        | ✅ Valid |
| 2.2 | Login dengan Kredensial Salah  | Memasukkan Email atau Password yang tidak terdaftar di Supabase Auth. | Sistem memunculkan notifikasi (toast) error: "Kredensial tidak valid".               | ✅ Valid |
| 2.3 | Login dengan Kredensial Benar  | Memasukkan Email dan Password Admin yang valid.                       | Sistem memunculkan toast sukses dan mengarahkan pengguna ke Halaman Dashboard Admin. | ✅ Valid |
| 2.4 | Akses Paksa (Bypass Auth)      | Mencoba mengakses `/admin/dashboard` tanpa login.                     | Middleware sistem memblokir akses dan meredirect kembali ke `/admin/login`.          | ✅ Valid |
| 2.5 | Logout dari Sistem             | Klik tombol "Logout" di sidebar menu.                                 | Sesi dihapus, user diarahkan kembali ke halaman Login.                               | ✅ Valid |

---

## 3. Pengujian Modul Manajemen Master Data (Dashboard)

| No  | Skenario Pengujian                  | Skenario Input (Tindakan)                                                       | Hasil yang Diharapkan                                                                                      | Status   |
| :-- | :---------------------------------- | :------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------- | :------- |
| 3.1 | Tambah Data Kerusakan / Gejala Baru | Mengisi kode dan nama pada form modal Tambah Data, lalu klik "Simpan".          | Data berhasil disimpan ke database, tabel ter-refresh otomatis, muncul toast sukses.                       | ✅ Valid |
| 3.2 | Auto-Increment ID Lock              | Membuka modal Tambah Data Kerusakan / Gejala.                                   | Kolom ID terisi otomatis (_gap-filling_) dan terkunci (_disabled_) sehingga tidak bisa dimanipulasi admin. | ✅ Valid |
| 3.3 | Hapus Data Master                   | Klik icon Tempat Sampah (Delete) pada baris data tabel.                         | Sistem menghapus data dari Supabase dan tabel ter-update tanpa perlu reload halaman.                       | ✅ Valid |
| 3.4 | Pembuatan Rule Baru (Rule Builder)  | Memilih Gejala, memilih Kerusakan, dan memasukkan nilai CF Pakar (0.1 - 1.0).   | Data rule beserta langkah (_step_) dan bobot CF tersimpan secara relasional ke tabel rules.                | ✅ Valid |
| 3.5 | Dashboard Statistik                 | Melihat ringkasan data di halaman utama Admin (Jumlah Kerusakan, Gejala, Rule). | Angka yang tampil sesuai (sinkron) dengan jumlah data unik (distinct) di dalam database saat itu.          | ✅ Valid |

---

## 4. Pengujian Modul Pengaturan Profil

| No  | Skenario Pengujian                 | Skenario Input (Tindakan)                                               | Hasil yang Diharapkan                                                                                    | Status   |
| :-- | :--------------------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- | :------- |
| 4.1 | Pembaruan Nama Profil              | Mengubah kolom "Nama Lengkap" lalu klik Simpan.                         | Nama berhasil diperbarui di Supabase Auth dan tampilan UI sidebar langsung ter-update (real-time state). | ✅ Valid |
| 4.2 | Ubah Sandi: Konfirmasi Tidak Cocok | Mengisi sandi baru "123456" tapi konfirmasi sandi "654321".             | Sistem menolak proses dan memunculkan toast error "Kata sandi tidak cocok".                              | ✅ Valid |
| 4.3 | Ubah Sandi: Sandi Lama Salah       | Mengisi sandi baru dengan benar, namun salah memasukkan sandi saat ini. | Sistem melakukan validasi (Re-Auth) ke Supabase dan memunculkan toast "Kata sandi saat ini salah".       | ✅ Valid |
| 4.4 | Pembaruan Sandi Berhasil           | Mengisi seluruh form sandi (lama, baru, konfirmasi) dengan valid.       | Kata sandi berhasil diubah, form (controlled input) langsung menjadi kosong, dan icon visibility reset.  | ✅ Valid |

---

## 📋 Kesimpulan Pengujian

Berdasarkan serangkaian uji coba (Black Box Testing) di atas, dapat disimpulkan bahwa keseluruhan fungsionalitas sistem berjalan sesuai dengan desain awal (_Expected Result_). Fitur interaksi pengguna (konsultasi), manajemen pakar, keamanan sistem, serta kalkulasi bobot matematika CF semuanya bernilai **VALID** dan berstatus **Siap untuk tahap Produksi (Production Ready)**.
