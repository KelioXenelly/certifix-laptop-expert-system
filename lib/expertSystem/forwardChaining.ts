import { Rule, Symptom } from '../../types';
import { calculateCumulativeCF, cfToPercentage } from './certaintyFactor';

export interface RulePath {
  rule_code: string;
  damage_id: string;
  steps: {
    symptom_id: string;
    expert_cf: number;
    step_order: number;
  }[];
}

/**
 * Mengubah flat data rules dari Supabase menjadi struktur path per Rule (R1, R2, dst).
 */
export function buildRulePaths(rules: Rule[]): RulePath[] {
  const pathsMap = new Map<string, RulePath>();

  // Urutkan berdasarkan rule_code dan step_order agar alur tree terjamin
  const sortedRules = [...rules].sort((a, b) => {
    if (a.rule_code === b.rule_code) {
      return a.step_order - b.step_order;
    }
    // Sort rule_code secara natural (R1, R2, R10)
    const numA = parseInt(a.rule_code.replace('R', ''));
    const numB = parseInt(b.rule_code.replace('R', ''));
    return numA - numB;
  });

  for (const rule of sortedRules) {
    if (!pathsMap.has(rule.rule_code)) {
      pathsMap.set(rule.rule_code, {
        rule_code: rule.rule_code,
        damage_id: rule.damage_id,
        steps: []
      });
    }
    pathsMap.get(rule.rule_code)!.steps.push({
      symptom_id: rule.symptom_id,
      expert_cf: rule.expert_cf,
      step_order: rule.step_order
    });
  }

  return Array.from(pathsMap.values());
}

export interface InferenceResult {
  isFinished: boolean;
  nextSymptomId?: string;
  diagnosis?: {
    damage_id: string;
    cf_percentage: number;
    matched_rule: string;
  };
}

/**
 * Forward Chaining Engine dengan Decision Tree Traversal.
 * Akan melakukan iterasi ke seluruh RulePaths. 
 * Jika ada jawaban 'TIDAK' (false) pada sebuah path, path tersebut langsung di-SKIP (mati).
 */
export function inferNextStep(
  rulePaths: RulePath[],
  userAnswers: Record<string, boolean>
): InferenceResult {
  
  for (const path of rulePaths) {
    let pathIsAlive = true;
    let symptomsChecked = 0;
    const collectedCFs: number[] = [];

    // Telusuri Tree Branch (Rule) ini secara sekuensial
    for (const step of path.steps) {
      const answer = userAnswers[step.symptom_id];

      if (answer === undefined) {
        // Kita menemukan node yang belum ditanyakan!
        // Hentikan penelusuran, minta UI menanyakan ini ke user.
        return {
          isFinished: false,
          nextSymptomId: step.symptom_id
        };
      }

      if (answer === false) {
        // User menjawab TIDAK. Cabang pohon ini MATI (Pruned).
        // Skip sisa step di rule ini, lanjut evaluasi rule berikutnya.
        pathIsAlive = false;
        break;
      }

      if (answer === true) {
        // Lanjut ke kedalaman tree berikutnya
        collectedCFs.push(step.expert_cf);
        symptomsChecked++;
      }
    }

    // Jika seluruh node dalam cabang ini dilewati dan bernilai TRUE
    if (pathIsAlive && symptomsChecked === path.steps.length) {
      const finalCF = calculateCumulativeCF(collectedCFs);
      
      return {
        isFinished: true,
        diagnosis: {
          damage_id: path.damage_id,
          cf_percentage: cfToPercentage(finalCF),
          matched_rule: path.rule_code
        }
      };
    }
  }

  // Jika kita keluar dari loop dan tidak ada path yang berhasil / tidak ada pertanyaan tersisa
  return {
    isFinished: true,
    diagnosis: undefined // Artinya tidak terdiagnosa kerusakan apa pun (Healthy / Unknown)
  };
}
