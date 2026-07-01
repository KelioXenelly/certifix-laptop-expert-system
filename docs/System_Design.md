# System Design & Architecture

## 1. Inference Engine Logic (Metode Tiga Tahap Terintegrasi)

Sistem menggunakan metode 3 tahap berurutan sesuai dengan pemetaan di makalah:

1. **Decision Tree Mapping (Pemetaan Awal):** Basis pengetahuan dipetakan ke dalam bentuk struktur hierarki (Pohon Keputusan) melalui tabel `rule` menggunakan pengelompokan `rule_code`. Ini mencegah konflik aturan dan redundansi.
2. **Forward Chaining Traversal (Mesin Penelusur):** Mesin berjalan menelusuri cabang *Decision Tree* (mulai dari *root*).
   - Jika _user_ menjawab **"Ya"**, mesin lanjut ke node (gejala) berikutnya di cabang (*rule*) yang sama.
   - Jika _user_ menjawab **"Tidak"**, cabang tersebut gugur. Mesin akan otomatis melompati (*skip*) sisa pertanyaan di cabang itu dan berpindah mengevaluasi *Rule* lain yang masih valid, **tanpa menanyakan ulang** gejala yang sudah pernah dijawab.
3. **Certainty Factor Calculation:** Saat penelusuran sampai di ujung cabang (konklusi kerusakan), mesin menghitung probabilitas menggunakan rumus CF Kombinasi berdasarkan bobot Pakar (`expert_cf`) dari semua gejala yang dijawab "Ya":
   $CF_{combine}(CF_1, CF_2) = CF_1 + CF_2 \times (1 - CF_1)$
   Hasil akhir dikalikan 100 untuk menghasilkan nilai persentase akurasi (misal: 85%).

## 2. Database Schema (PostgreSQL via Supabase)

Struktur _database_ dirancang khusus untuk mendukung kuesioner dinamis[cite: 9].

```sql
-- 1. Create Damage Table
CREATE TABLE damage (
    damage_id VARCHAR(10) PRIMARY KEY,
    damage_name VARCHAR(100) NOT NULL,
    solution TEXT NOT NULL
);

-- 2. Create Symptom Table
CREATE TABLE symptom (
    symptom_id VARCHAR(10) PRIMARY KEY,
    symptom_name VARCHAR(255) NOT NULL,
    question_text TEXT NOT NULL
);

-- 3. Create Rule Table (Junction Table Teroptimasi untuk Decision Tree)
CREATE TABLE rule (
    id SERIAL PRIMARY KEY,
    rule_code VARCHAR(10) NOT NULL,
    damage_id VARCHAR(10) REFERENCES damage(damage_id) ON DELETE CASCADE,
    symptom_id VARCHAR(10) REFERENCES symptom(symptom_id) ON DELETE CASCADE,
    step_order INT NOT NULL, -- Mencegah aturan acak, memastikan urutan hierarki pohon
    expert_cf NUMERIC(3,2) NOT NULL
);

-- 4. Create Diagnosis History Table
CREATE TABLE diagnosis_history (
    history_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    diagnosed_damage VARCHAR(100) NOT NULL,
    cf_percentage NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
);
```

## 3. Frontend Architecture (Tailwind CSS + MUI)

Sistem menggunakan kombinasi Tailwind CSS dan Material UI (MUI). Untuk mencegah konflik *styling* CSS:
- **Tailwind CSS** digunakan untuk struktur tata letak (layout), *spacing*, warna, dan responsivitas.
- **MUI** digunakan khusus untuk komponen interaktif kompleks (seperti form admin, DataGrid, Modal, Switch).
- **Integrasi (Best Practice):** Pada `app/layout.tsx`, akan digunakan `<StyledEngineProvider injectFirst>` dari MUI. Ini memastikan *style* default MUI dimuat *sebelum* Tailwind, sehingga *utility class* Tailwind dapat dengan mudah menimpa (*override*) gaya bawaan MUI.
