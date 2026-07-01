/**
 * Kombinasi Certainty Factor (CF) untuk dua gejala yang mengarah ke kerusakan yang sama.
 * Rumus: CF_Combine = CF1 + CF2 * (1 - CF1)
 */
export function combineCF(cf1: number, cf2: number): number {
  return cf1 + cf2 * (1 - cf1);
}

/**
 * Menghitung CF Kumulatif dari sebuah array nilai CF.
 * Digunakan ketika sebuah rule memiliki banyak gejala (Symptom) yang bernilai 'Ya'.
 */
export function calculateCumulativeCF(cfArray: number[]): number {
  if (cfArray.length === 0) return 0;
  if (cfArray.length === 1) return cfArray[0];

  let currentCF = cfArray[0];
  for (let i = 1; i < cfArray.length; i++) {
    currentCF = combineCF(currentCF, cfArray[i]);
  }
  
  return currentCF;
}

/**
 * Konversi CF ke persentase yang mudah dibaca (0 - 100%)
 */
export function cfToPercentage(cf: number): number {
  return parseFloat((cf * 100).toFixed(2));
}
