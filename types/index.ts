export interface Damage {
  damage_id: string;
  damage_name: string;
  solution: string;
}

export interface Symptom {
  symptom_id: string;
  symptom_name: string;
  question_text: string;
}

export interface Rule {
  id: number;
  rule_code: string;
  damage_id: string;
  symptom_id: string;
  step_order: number;
  expert_cf: number;
}

export interface DiagnosisHistory {
  history_id: string;
  username: string;
  diagnosed_damage: string;
  cf_percentage: number;
  created_at: string;
}
