/**
 * Convert numbers to Hebrew letters (Gematria)
 */

const hebrewNumerals: { [key: number]: string } = {
  1: 'א',
  2: 'ב',
  3: 'ג',
  4: 'ד',
  5: 'ה',
  6: 'ו',
  7: 'ז',
  8: 'ח',
  9: 'ט',
  10: 'י',
  20: 'כ',
  30: 'ל',
  40: 'מ',
  50: 'נ',
  60: 'ס',
  70: 'ע',
  80: 'פ',
  90: 'צ',
  100: 'ק',
  200: 'ר',
  300: 'ש',
  400: 'ת',
};

/**
 * Convert a number to Hebrew letters
 * @param num - Number to convert (1-999)
 * @returns Hebrew letter representation
 */
export function toHebrewNumeral(num: number): string {
  if (num < 1 || num > 999) {
    return num.toString();
  }

  // Special cases to avoid writing the name of God
  if (num === 15 || num === 16) {
    return num === 15 ? 'טו' : 'טז';
  }

  let result = '';
  let remaining = num;

  // Hundreds
  const hundreds = Math.floor(remaining / 100) * 100;
  if (hundreds > 0) {
    result += hebrewNumerals[hundreds];
    remaining -= hundreds;
  }

  // Tens
  const tens = Math.floor(remaining / 10) * 10;
  if (tens > 0) {
    result += hebrewNumerals[tens];
    remaining -= tens;
  }

  // Ones
  if (remaining > 0) {
    result += hebrewNumerals[remaining];
  }

  // Add geresh (׳) for single letter or gershayim (״) for multiple letters
  if (result.length === 1) {
    result += '׳';
  } else if (result.length > 1) {
    result = result.slice(0, -1) + '״' + result.slice(-1);
  }

  return result;
}

/**
 * Format chapter number in Hebrew
 * @param num - Chapter number
 * @returns Formatted string "פרק [Hebrew number]"
 */
export function formatHebrewChapter(num: number): string {
  return `פרק ${toHebrewNumeral(num)}`;
}

/**
 * Convert Hebrew letters back to a number
 * @param hebrewStr - Hebrew numeral string (with or without geresh/gershayim)
 * @returns Number value (or NaN if invalid)
 */
export function fromHebrewNumeral(hebrewStr: string): number {
  if (!hebrewStr) return NaN;

  // Remove geresh (׳) and gershayim (״)
  let cleaned = hebrewStr.replace(/[׳״]/g, '');

  // Create reverse mapping
  const reverseNumerals: { [key: string]: number } = {};
  Object.entries(hebrewNumerals).forEach(([num, letter]) => {
    reverseNumerals[letter] = parseInt(num, 10);
  });

  // Handle special cases for 15 and 16
  if (cleaned === 'טו') return 15;
  if (cleaned === 'טז') return 16;

  // Convert each letter and sum
  let total = 0;
  for (let i = 0; i < cleaned.length; i++) {
    const letter = cleaned[i];
    const value = reverseNumerals[letter];
    if (value === undefined) {
      return NaN; // Invalid character
    }
    total += value;
  }

  return total;
}
