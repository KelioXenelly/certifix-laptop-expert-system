# 💻 CertiFix | Sistem Pakar Diagnosa Kerusakan Laptop

**CertiFix** adalah aplikasi sistem pakar (_Expert System_) berbasis web yang dirancang untuk mendeteksi dan mendiagnosa kerusakan perangkat keras (hardware) pada laptop. Sistem ini meniru logika pemecahan masalah dari seorang teknisi ahli untuk memberikan diagnosa instan beserta solusi penanganan pertama kepada pengguna awam.

---

## 🧠 Algoritma Inti

Sistem ini didukung oleh tiga pilar algoritma kecerdasan buatan (AI) klasik:

1. **Decision Tree:** Memetakan struktur alur pertanyaan (gejala) yang dinamis.
2. **Forward Chaining:** Mesin inferensi (_Inference Engine_) yang menelusuri fakta-fakta (jawaban user) dari awal untuk mencapai sebuah kesimpulan (diagnosa kerusakan).
3. **Certainty Factor (CF):** Menghitung persentase tingkat keyakinan (akurasi) dari hasil diagnosa berdasarkan bobot nilai kepastian dari setiap pakar terhadap sebuah gejala.

## ✨ Fitur Utama

### 🧑‍💻 Untuk Pengguna (Pasien)

- **Konsultasi Dinamis:** Kuesioner interaktif langkah-demi-langkah dengan dukungan navigasi _Keyboard Shortcuts_ (Y/T & Panah Kiri/Kanan).
- **Laporan Diagnosa:** Menampilkan persentase kepastian (CF) dan rekomendasi perbaikan/solusi langkah pertama.
- **UI/UX Modern:** Desain antarmuka _Glassmorphism_ yang memukau, responsif, dilengkapi animasi mulus, dan _loading skeleton_.

### 🛡️ Untuk Administrator

- **Dashboard Ringkasan:** Memantau total kerusakan, gejala, aturan pakar (_rules_), dan riwayat diagnosa terbaru.
- **Manajemen Basis Pengetahuan:**
  - **CRUD Kerusakan & Gejala:** Pengelolaan data master lengkap dengan sistem _Auto-Increment ID_ cerdas yang mendeteksi dan mengisi celah ID (gap-filling).
  - **Rule Builder:** Antarmuka visual untuk merangkai kondisi (Gejala A -> Gejala B) ke Target Kerusakan beserta pengaturan bobot CF.
- **Riwayat Diagnosa:** Halaman pencarian dan pengurutan (sorting) data riwayat konsultasi pasien.
- **Autentikasi Aman:** Sistem _login_ & manajemen profil administrator terintegrasi langsung dengan **Supabase Auth**.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Komponen UI:** [Material-UI (MUI)](https://mui.com/)
- **Notifikasi:** [Sonner](https://sonner.emilkowal.ski/)
- **Ikon:** Material Icons

---

## 🚀 Cara Menjalankan Secara Lokal (Development)

1. **Clone repository ini:**

   ```bash
   git clone https://github.com/username/certifix-laptop-expert-system.git
   cd certifix-laptop-expert-system
   ```

2. **Install dependencies (Disarankan menggunakan `pnpm`):**

   ```bash
   pnpm install
   ```

3. **Konfigurasi Environment Variables:**
   Buat file `.env.local` di _root directory_ proyek dan isi dengan kredensial Supabase Anda:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Jalankan Development Server:**

   ```bash
   pnpm dev
   ```

5. **Buka di Browser:**
   Akses `http://localhost:3000` untuk melihat aplikasi pengguna, atau `http://localhost:3000/admin` untuk mengakses _dashboard administrator_.

---

## 📦 Deployment ke Vercel

Aplikasi ini sudah dioptimalkan dan sepenuhnya siap untuk di-_deploy_ ke **Vercel**.

1. Push repository ini ke akun GitHub Anda.
2. Buat proyek baru di [Vercel](https://vercel.com/new).
3. Hubungkan ke repositori GitHub proyek ini.
4. Jangan lupa tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` ke menu **Environment Variables** di pengaturan proyek Vercel Anda.
5. Klik **Deploy**.

---

© 2026 CertiFix Expert System. All rights reserved.
