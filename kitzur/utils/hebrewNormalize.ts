// Full normalization: remove nikud, normalize final forms, unify punctuation
export function normalizeHebrew(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFC")
    // remove niqqud & cantillation
    .replace(/[\u0591-\u05C7]/g, "")
    // unify punctuation
    .replace(/[״"]/g, "״")
    .replace(/[׳']/g, "׳")
    // normalize final forms
    .replace(/ך/g, "כ")
    .replace(/ם/g, "מ")
    .replace(/ן/g, "נ")
    .replace(/ף/g, "פ")
    .replace(/ץ/g, "צ")
    // trim spaces
    .trim();
}
