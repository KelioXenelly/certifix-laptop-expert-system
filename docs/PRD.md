# Product Requirements Document (PRD)

## 1. Project Overview

**Project Name:** CertiFix - Sistem Pakar Diagnosa Kerusakan Hardware Laptop
**Description:** Sebuah aplikasi web cerdas terintegrasi yang mendiagnosa kerusakan perangkat keras laptop melalui kuesioner dinamis. Sistem ini mengombinasikan tiga metode utama: **Decision Tree** untuk pemetaan struktur hierarki (*knowledge base*), **Forward Chaining** sebagai mesin inferensi untuk menelusuri pohon keputusan tanpa redundansi, dan **Certainty Factor (CF)** untuk menghitung probabilitas akurasi diagnosis akhir.

## 2. Problem Statement

Pengguna awam dan teknisi junior sering kesulitan mengidentifikasi kerusakan _hardware_ laptop secara spesifik. Sistem pakar konvensional seringkali statis dan memiliki aturan (_rules_) yang dirumuskan secara acak tanpa pemetaan logika yang jelas, menyebabkan tumpang tindih (_redundancy_) dan pertanyaan berulang. CertiFix menyelesaikan masalah ini dengan mengintegrasikan **Decision Tree** sebagai fondasi struktur penelusuran agar eksekusi **Forward Chaining** menjadi adaptif (otomatis _skip_ pertanyaan tidak relevan jika beda cabang), lalu diakhiri dengan kalkulasi CF untuk hasil yang presisi.

## 3. Target Audience

1. **End-Users / Casual Laptop Owners:** Menggunakan sistem untuk konsultasi awal kerusakan laptop melalui form kuesioner tanpa perlu mendaftar akun.
2. **System Administrator / Pakar:** Mengelola _knowledge base_ secara dinamis melalui dasbor CRUD yang diamankan dengan autentikasi[cite: 9].

## 4. Tech Stack & Environment

- **Frontend Framework:** Next.js 14+ (App Router), React, TypeScript[cite: 9].
- **Styling & UI Components:** Tailwind CSS dikombinasikan dengan Material UI (MUI).
- **Backend & Database:** Supabase (PostgreSQL) untuk penyimpanan _Knowledge Base_ dinamis[cite: 9].
- **Authentication:** Supabase Auth (Email & Password) khusus untuk rute Admin/Pakar.
- **Hosting & Deployment:** Vercel (untuk _Frontend_ Next.js) dan Supabase (BaaS).

## 5. Feature Requirements

### 5.1 Client-Side (Konsultasi Pengguna)

- **Welcome & Identity Screen:** Meminta input nama pengguna (`username`) sebelum memulai konsultasi, tanpa mewajibkan _login/register_.
- **Dynamic Q&A Questionnaire:** Menampilkan pertanyaan satu per satu menelusuri cabang _Decision Tree_. Jawaban "Tidak" akan memicu sistem untuk melakukan _skip_ sisa pertanyaan di cabang tersebut dan berpindah ke aturan (_rule_) lain tanpa mengulang pertanyaan yang sama.
- **Real-Time Inference Engine:** Mengeksekusi penelusuran _Forward Chaining_ di atas struktur hierarki _Decision Tree_ secara _real-time_. Jika _user_ menjawab "Ya", bobot kepastian (User CF) diasumsikan 1.0 (pasti).
- **Diagnosis Result:** Menampilkan kesimpulan kerusakan (`diagnosed_damage`), solusi penanganan (`solution`), dan persentase kepastian kalkulasi kombinasi _expert_cf_ (`cf_percentage`).
- **Automated Logging:** Menyimpan otomatis hasil sesi konsultasi ke tabel `diagnosis_history`[cite: 9].

### 5.2 Admin-Side (Dashboard Pakar)

- **Secure Login:** Gerbang masuk menggunakan Supabase Auth.
- **Analytics Overview:** Ringkasan data jumlah kerusakan, gejala, _rules_, dan riwayat konsultasi.
- **Damage Management:** Operasi CRUD untuk tabel `damage`[cite: 9].
- **Symptom Management:** Operasi CRUD untuk tabel `symptom`, termasuk manajemen kolom `question_text` untuk kuesioner[cite: 9].
- **Rule Management:** Mengelola pemetaan _Decision Tree_ menggunakan relasi tabel `rule`, mengelompokkan jalur melalui atribut `rule_code`, serta menyesuaikan nilai `expert_cf`[cite: 9].
