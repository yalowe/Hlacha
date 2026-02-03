/**
 * Utility for loading and managing Parsha content (Shnayim Mikra v'Echad Targum)
 */

export interface Verse {
  verseNum: number;
  hebrew: string;
  targum: string;
  english?: string;
}

export interface ParshaChapter {
  chapter: number;
  verses: Verse[];
}

export interface Parsha {
  name: string;
  book: string;
  chapters: ParshaChapter[];
}

// List of all parshiot in order
export const PARSHIOT_LIST = [
  // Bereishit (Genesis)
  { id: 'bereishit', name: 'בראשית', nameEn: 'Bereishit', book: 'בראשית' },
  { id: 'noach', name: 'נח', nameEn: 'Noach', book: 'בראשית' },
  { id: 'lech-lecha', name: 'לך לך', nameEn: 'Lech-Lecha', book: 'בראשית' },
  { id: 'vayera', name: 'וירא', nameEn: 'Vayera', book: 'בראשית' },
  { id: 'chayei_sara', name: 'חיי שרה', nameEn: 'Chayei Sara', book: 'בראשית' },
  { id: 'toldot', name: 'תולדות', nameEn: 'Toldot', book: 'בראשית' },
  { id: 'vayetzei', name: 'ויצא', nameEn: 'Vayetzei', book: 'בראשית' },
  { id: 'vayishlach', name: 'וישלח', nameEn: 'Vayishlach', book: 'בראשית' },
  { id: 'vayeshev', name: 'וישב', nameEn: 'Vayeshev', book: 'בראשית' },
  { id: 'miketz', name: 'מקץ', nameEn: 'Miketz', book: 'בראשית' },
  { id: 'vayigash', name: 'ויגש', nameEn: 'Vayigash', book: 'בראשית' },
  { id: 'vayechi', name: 'ויחי', nameEn: 'Vayechi', book: 'בראשית' },
  
  // Shemot (Exodus)
  { id: 'shemot', name: 'שמות', nameEn: 'Shemot', book: 'שמות' },
  { id: 'vaera', name: 'וארא', nameEn: 'Vaera', book: 'שמות' },
  { id: 'bo', name: 'בא', nameEn: 'Bo', book: 'שמות' },
  { id: 'beshalach', name: 'בשלח', nameEn: 'Beshalach', book: 'שמות' },
  { id: 'yitro', name: 'יתרו', nameEn: 'Yitro', book: 'שמות' },
  { id: 'mishpatim', name: 'משפטים', nameEn: 'Mishpatim', book: 'שמות' },
  { id: 'terumah', name: 'תרומה', nameEn: 'Terumah', book: 'שמות' },
  { id: 'tetzaveh', name: 'תצוה', nameEn: 'Tetzaveh', book: 'שמות' },
  { id: 'ki_tisa', name: 'כי תשא', nameEn: 'Ki Tisa', book: 'שמות' },
  { id: 'vayakhel', name: 'ויקהל', nameEn: 'Vayakhel', book: 'שמות' },
  { id: 'pekudei', name: 'פקודי', nameEn: 'Pekudei', book: 'שמות' },
  
  // Vayikra (Leviticus)
  { id: 'vayikra', name: 'ויקרא', nameEn: 'Vayikra', book: 'ויקרא' },
  { id: 'tzav', name: 'צו', nameEn: 'Tzav', book: 'ויקרא' },
  { id: 'shmini', name: 'שמיני', nameEn: 'Shmini', book: 'ויקרא' },
  { id: 'tazria', name: 'תזריע', nameEn: 'Tazria', book: 'ויקרא' },
  { id: 'metzora', name: 'מצורע', nameEn: 'Metzora', book: 'ויקרא' },
  { id: 'achrei_mot', name: 'אחרי מות', nameEn: 'Achrei Mot', book: 'ויקרא' },
  { id: 'kedoshim', name: 'קדושים', nameEn: 'Kedoshim', book: 'ויקרא' },
  { id: 'emor', name: 'אמור', nameEn: 'Emor', book: 'ויקרא' },
  { id: 'behar', name: 'בהר', nameEn: 'Behar', book: 'ויקרא' },
  { id: 'bechukotai', name: 'בחוקתי', nameEn: 'Bechukotai', book: 'ויקרא' },
  
  // Bamidbar (Numbers)
  { id: 'bamidbar', name: 'במדבר', nameEn: 'Bamidbar', book: 'במדבר' },
  { id: 'nasso', name: 'נשא', nameEn: 'Nasso', book: 'במדבר' },
  { id: 'behaalotcha', name: 'בהעלותך', nameEn: 'Beha\'alotcha', book: 'במדבר' },
  { id: 'shlach', name: 'שלח', nameEn: 'Sh\'lach', book: 'במדבר' },
  { id: 'korach', name: 'קרח', nameEn: 'Korach', book: 'במדבר' },
  { id: 'chukat', name: 'חקת', nameEn: 'Chukat', book: 'במדבר' },
  { id: 'balak', name: 'בלק', nameEn: 'Balak', book: 'במדבר' },
  { id: 'pinchas', name: 'פנחס', nameEn: 'Pinchas', book: 'במדבר' },
  { id: 'matot', name: 'מטות', nameEn: 'Matot', book: 'במדבר' },
  { id: 'masei', name: 'מסעי', nameEn: 'Masei', book: 'במדבר' },
  
  // Devarim (Deuteronomy)
  { id: 'devarim', name: 'דברים', nameEn: 'Devarim', book: 'דברים' },
  { id: 'vaetchanan', name: 'ואתחנן', nameEn: 'Vaetchanan', book: 'דברים' },
  { id: 'eikev', name: 'עקב', nameEn: 'Eikev', book: 'דברים' },
  { id: 'reeh', name: 'ראה', nameEn: 'Re\'eh', book: 'דברים' },
  { id: 'shoftim', name: 'שופטים', nameEn: 'Shoftim', book: 'דברים' },
  { id: 'ki_teitzei', name: 'כי תצא', nameEn: 'Ki Teitzei', book: 'דברים' },
  { id: 'ki_tavo', name: 'כי תבוא', nameEn: 'Ki Tavo', book: 'דברים' },
  { id: 'nitzavim', name: 'נצבים', nameEn: 'Nitzavim', book: 'דברים' },
  { id: 'vayeilech', name: 'וילך', nameEn: 'Vayeilech', book: 'דברים' },
  { id: 'haazinu', name: 'האזינו', nameEn: 'Ha\'Azinu', book: 'דברים' },
  { id: 'vzot_haberachah', name: 'וזאת הברכה', nameEn: 'V\'Zot HaBerachah', book: 'דברים' }
];

/**
 * Load a specific parsha by ID
 */
export async function loadParsha(parshaId: string): Promise<Parsha | null> {
  try {
    // Use dynamic import for the registry to avoid loading all parshiot upfront
    const { parshiotRegistry } = await import('../content/parshiot-index');
    const parsha = parshiotRegistry[parshaId];
    
    if (!parsha) {
      console.error(`Parsha ${parshaId} not found in registry`);
      return null;
    }
    
    return parsha;
  } catch (error) {
    console.error(`Error loading parsha ${parshaId}:`, error);
    return null;
  }
}

/**
 * Get all available parshiot
 */
export function getAllParshiot() {
  return PARSHIOT_LIST;
}

/**
 * Get parshiot grouped by book
 */
export function getParshiotByBook() {
  const books = {
    'בראשית': [] as typeof PARSHIOT_LIST,
    'שמות': [] as typeof PARSHIOT_LIST,
    'ויקרא': [] as typeof PARSHIOT_LIST,
    'במדבר': [] as typeof PARSHIOT_LIST,
    'דברים': [] as typeof PARSHIOT_LIST,
  };

  PARSHIOT_LIST.forEach(parsha => {
    if (books[parsha.book as keyof typeof books]) {
      books[parsha.book as keyof typeof books].push(parsha);
    }
  });

  return books;
}

/**
 * Get the current week's parsha (this is a simplified version - 
 * you might want to implement a proper Hebrew calendar library)
 */
export function getCurrentParsha(): typeof PARSHIOT_LIST[0] | null {
  // This would need a Hebrew calendar implementation
  // For now, return the first parsha
  return PARSHIOT_LIST[0];
}
