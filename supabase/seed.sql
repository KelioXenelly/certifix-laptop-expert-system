-- ====================================================================
-- SEEDER DATA SISTEM PAKAR CERTIFIX (SESUAI DOKUMEN UAS)
-- ====================================================================

-- 1. INSERT DATA KERUSAKAN (5 Jenis Kerusakan dari TABEL I)
INSERT INTO damage (damage_id, damage_name, solution) VALUES
('P001', 'Hang', 'Segera bersihkan debu pada kipas/sistem pendingin (Overheating). Pastikan driver perangkat (terutama device non-onboard) terinstal dengan benar, dan periksa kesehatan hardisk yang melambat.'),
('P002', 'Mati Total', 'Periksa adaptor daya dan pastikan baterai dapat menyimpan arus. Jika adaptor normal, segera bawa ke teknisi karena kemungkinan terjadi korsleting (short) pada blok power di mainboard.'),
('P003', 'Tidak Tampil (No Display)', 'Lakukan pengecekan pada memori (RAM) dan prosesor. Ganti thermal paste pada chipset jika sudah kering. Pastikan instalasi device non-onboard terpasang sempurna.'),
('P004', 'Tidak Men-charge', 'Periksa spesifikasi adaptor daya pastikan sesuai dengan voltase laptop. Jika adaptor normal, kemungkinan ada kerusakan pada blok charger di mainboard (tegangan nihil/short).'),
('P005', 'Power Drop', 'Terdapat masalah pada tegangan blok power mainboard atau tombol switch on. Hindari menyalakan paksa dan segera cek komponen power di mainboard ke teknisi.');

-- 2. INSERT DATA GEJALA (15 Gejala dari TABEL II, Diubah jadi Kuesioner)
INSERT INTO symptom (symptom_id, symptom_name, question_text) VALUES
('G001', 'Laptop terlalu panas (Over Heating)', 'Apakah laptop Anda terasa sangat panas (Overheating) saat digunakan?'),
('G002', 'Batery tidak menyimpan arus', 'Apakah baterai laptop Anda sudah tidak dapat menyimpan arus (cepat habis/mati jika cabut charger)?'),
('G003', 'Memori rusak', 'Apakah terindikasi ada kerusakan pada memori (Memory Crash / RAM)?'),
('G004', 'Prosesor mati', 'Apakah terindikasi prosesor laptop tidak berfungsi (Prosesor Mati)?'),
('G005', 'Power dari Adaptor tidak masuk', 'Apakah daya/power dari Adaptor (Charger) sama sekali tidak masuk ke laptop?'),
('G006', 'Driver tidak terinstal', 'Apakah ada indikasi driver perangkat (khususnya Device Non Onboard) tidak terinstal dengan sempurna?'),
('G007', 'Tegangan Power Utama di Motherboard Nihil', 'Apakah tegangan power utama pada Motherboard terukur nihil (hilang)?'),
('G008', 'Pasta pada Chipset kurang baik', 'Apakah thermal paste pada chipset sudah kering atau kondisinya kurang baik?'),
('G009', 'Kinerja Hardisk melambat', 'Apakah kinerja sistem terasa melambat yang disebabkan oleh Hardisk?'),
('G010', 'Tegangan Charger di Mainboard Nihil', 'Apakah tegangan dari blok charger di mainboard terukur nihil?'),
('G011', 'Power Supply Adaptor yang masuk tidak sesuai', 'Apakah power supply adaptor yang digunakan tidak sesuai dengan spesifikasi laptop?'),
('G012', 'Instalasi Onboard kurang sempurna', 'Apakah ada indikasi instalasi komponen Non-Onboard kurang sempurna?'),
('G013', 'Tegangan Blok Power di Mainboard Ada yang Short', 'Apakah ada indikasi korsleting (short) pada tegangan blok power di mainboard?'),
('G014', 'Led Indikator Power Tidak Menyala', 'Apakah lampu LED indikator power tidak menyala sama sekali?'),
('G015', 'Tombol Switch On Tidak Merespon', 'Apakah tombol power (switch on) ditekan tapi tidak memberikan respon?');

-- 3. INSERT DATA RULE (10 Aturan dari TABEL IV, Termasuk Nilai CF TABEL III)
-- Pengurutan INSERT mengikuti hierarki Pohon Keputusan (Decision Tree)

-- RULE R01: Hang (P001) -> G001, G006, G009
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R1', 'P001', 'G001', 1, 0.40),
('R1', 'P001', 'G006', 2, 1.00),
('R1', 'P001', 'G009', 3, 0.60);

-- RULE R02: Hang (P001) -> G001, G005, G006
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R2', 'P001', 'G001', 1, 0.40),
('R2', 'P001', 'G005', 2, 0.40),
('R2', 'P001', 'G006', 3, 1.00);

-- RULE R03: Mati Total (P002) -> G001, G003, G002, G005
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R3', 'P002', 'G001', 1, 0.40),
('R3', 'P002', 'G003', 2, 0.60),
('R3', 'P002', 'G002', 3, 0.40),
('R3', 'P002', 'G005', 4, 0.40);

-- RULE R04: Mati Total (P002) -> G005, G007, G013, G015
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R4', 'P002', 'G005', 1, 0.40),
('R4', 'P002', 'G007', 2, 0.80),
('R4', 'P002', 'G013', 3, 0.80),
('R4', 'P002', 'G015', 4, 1.00);

-- RULE R05: Mati Total (P002) -> G001, G002, G004, G006
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R5', 'P002', 'G001', 1, 0.40),
('R5', 'P002', 'G002', 2, 0.40),
('R5', 'P002', 'G004', 3, 0.60),
('R5', 'P002', 'G006', 4, 1.00);

-- RULE R06: Tidak Tampil (P003) -> G001, G003, G004, G008
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R6', 'P003', 'G001', 1, 0.40),
('R6', 'P003', 'G003', 2, 0.60),
('R6', 'P003', 'G004', 3, 0.60),
('R6', 'P003', 'G008', 4, 1.00);

-- RULE R07: Tidak Tampil (P003) -> G001, G003, G008, G009
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R7', 'P003', 'G001', 1, 0.40),
('R7', 'P003', 'G003', 2, 0.60),
('R7', 'P003', 'G008', 3, 1.00),
('R7', 'P003', 'G009', 4, 0.60);

-- RULE R08: Tidak Men-charge (P004) -> G002, G005, G010
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R8', 'P004', 'G002', 1, 0.40),
('R8', 'P004', 'G005', 2, 0.40),
('R8', 'P004', 'G010', 3, 1.00);

-- RULE R09: Tidak Tampil (P003) -> G003, G004, G005, G006
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R9', 'P003', 'G003', 1, 0.60),
('R9', 'P003', 'G004', 2, 0.60),
('R9', 'P003', 'G005', 3, 0.40),
('R9', 'P003', 'G006', 4, 1.00);

-- RULE R10: Tidak Men-charge (P004) -> G001, G011, G012, G013
INSERT INTO rule (rule_code, damage_id, symptom_id, step_order, expert_cf) VALUES
('R10', 'P004', 'G001', 1, 0.40),
('R10', 'P004', 'G011', 2, 0.40),
('R10', 'P004', 'G012', 3, 0.40),
('R10', 'P004', 'G013', 4, 0.80);