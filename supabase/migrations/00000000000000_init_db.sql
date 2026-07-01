-- ====================================================================
-- CERTIFIX DATABASE MIGRATION SCRIPT (SCHEMA ONLY)
-- ====================================================================

-- 1. Create Damage Table
CREATE TABLE IF NOT EXISTS damage (
    damage_id VARCHAR(10) PRIMARY KEY,
    damage_name VARCHAR(100) NOT NULL,
    solution TEXT NOT NULL
);

-- 2. Create Symptom Table
CREATE TABLE IF NOT EXISTS symptom (
    symptom_id VARCHAR(10) PRIMARY KEY,
    symptom_name VARCHAR(255) NOT NULL,
    question_text TEXT NOT NULL
);

-- 3. Create Rule Table
CREATE TABLE IF NOT EXISTS rule (
    id SERIAL PRIMARY KEY,
    rule_code VARCHAR(10) NOT NULL,
    damage_id VARCHAR(10) REFERENCES damage(damage_id) ON DELETE CASCADE,
    symptom_id VARCHAR(10) REFERENCES symptom(symptom_id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    expert_cf NUMERIC(3,2) NOT NULL
);

-- 4. Create Diagnosis History Table
CREATE TABLE IF NOT EXISTS diagnosis_history (
    history_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    diagnosed_damage VARCHAR(100) NOT NULL,
    cf_percentage NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
