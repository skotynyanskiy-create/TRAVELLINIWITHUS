/** Formatta un voto 0-10 con la virgola decimale italiana (es. 8.6 → "8,6"). */
export function formatScore(value: number): string {
  return value.toFixed(1).replace('.', ',');
}
