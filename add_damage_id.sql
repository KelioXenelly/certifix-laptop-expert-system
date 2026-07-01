ALTER TABLE diagnosis_history ADD COLUMN damage_id VARCHAR(10) REFERENCES damage(damage_id) ON DELETE SET NULL;
