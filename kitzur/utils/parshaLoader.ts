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
  { id: 'bereishit', name: 'בְּרֵאשִׁית', nameEn: 'Bereishit', book: 'בראשית' },
  { id: 'noach', name: 'נֹחַ', nameEn: 'Noach', book: 'בראשית' },
  { id: 'lech-lecha', name: 'לֶךְ לְךָ', nameEn: 'Lech-Lecha', book: 'בראשית' },
  { id: 'vayera', name: 'וַיֵּרָא', nameEn: 'Vayera', book: 'בראשית' },
  { id: 'chayei_sara', name: 'חַיֵּי שָׂרָה', nameEn: 'Chayei Sara', book: 'בראשית' },
  { id: 'toldot', name: 'תּוֹלְדוֹת', nameEn: 'Toldot', book: 'בראשית' },
  { id: 'vayetzei', name: 'וַיֵּצֵא', nameEn: 'Vayetzei', book: 'בראשית' },
  { id: 'vayishlach', name: 'וַיִּשְׁלַח', nameEn: 'Vayishlach', book: 'בראשית' },
  { id: 'vayeshev', name: 'וַיֵּשֶׁב', nameEn: 'Vayeshev', book: 'בראשית' },
  { id: 'miketz', name: 'מִקֵּץ', nameEn: 'Miketz', book: 'בראשית' },
  { id: 'vayigash', name: 'וַיִּגַּשׁ', nameEn: 'Vayigash', book: 'בראשית' },
  { id: 'vayechi', name: 'וַיְחִי', nameEn: 'Vayechi', book: 'בראשית' },
  
  // Shemot (Exodus)
  { id: 'shemot', name: 'שְׁמוֹת', nameEn: 'Shemot', book: 'שמות' },
  { id: 'vaera', name: 'וָאֵרָא', nameEn: 'Vaera', book: 'שמות' },
  { id: 'bo', name: 'בֹּא', nameEn: 'Bo', book: 'שמות' },
  { id: 'beshalach', name: 'בְּשַׁלַּח', nameEn: 'Beshalach', book: 'שמות' },
  { id: 'yitro', name: 'יִתְרוֹ', nameEn: 'Yitro', book: 'שמות' },
  { id: 'mishpatim', name: 'מִשְׁפָּטִים', nameEn: 'Mishpatim', book: 'שמות' },
  { id: 'terumah', name: 'תְּרוּמָה', nameEn: 'Terumah', book: 'שמות' },
  { id: 'tetzaveh', name: 'תְּצַוֶּה', nameEn: 'Tetzaveh', book: 'שמות' },
  { id: 'ki_tisa', name: 'כִּי תִשָּׂא', nameEn: 'Ki Tisa', book: 'שמות' },
  { id: 'vayakhel', name: 'וַיַּקְהֵל', nameEn: 'Vayakhel', book: 'שמות' },
  { id: 'pekudei', name: 'פְקוּדֵי', nameEn: 'Pekudei', book: 'שמות' },
  
  // Vayikra (Leviticus)
  { id: 'vayikra', name: 'וַיִּקְרָא', nameEn: 'Vayikra', book: 'ויקרא' },
  { id: 'tzav', name: 'צַו', nameEn: 'Tzav', book: 'ויקרא' },
  { id: 'shmini', name: 'שְׁמִינִי', nameEn: 'Shmini', book: 'ויקרא' },
  { id: 'tazria', name: 'תַּזְרִיעַ', nameEn: 'Tazria', book: 'ויקרא' },
  { id: 'metzora', name: 'מְּצֹרָע', nameEn: 'Metzora', book: 'ויקרא' },
  { id: 'achrei_mot', name: 'אַחֲרֵי מוֹת', nameEn: 'Achrei Mot', book: 'ויקרא' },
  { id: 'kedoshim', name: 'קְדֹשִׁים', nameEn: 'Kedoshim', book: 'ויקרא' },
  { id: 'emor', name: 'אֱמֹר', nameEn: 'Emor', book: 'ויקרא' },
  { id: 'behar', name: 'בְּהַר', nameEn: 'Behar', book: 'ויקרא' },
  { id: 'bechukotai', name: 'בְּחֻקֹּתַי', nameEn: 'Bechukotai', book: 'ויקרא' },
  
  // Bamidbar (Numbers)
  { id: 'bamidbar', name: 'בְּמִדְבַּר', nameEn: 'Bamidbar', book: 'במדבר' },
  { id: 'nasso', name: 'נָשֹׂא', nameEn: 'Nasso', book: 'במדבר' },
  { id: 'behaalotcha', name: 'בְּהַעֲלֹתְךָ', nameEn: 'Beha\'alotcha', book: 'במדבר' },
  { id: 'shlach', name: 'שְׁלַח', nameEn: 'Sh\'lach', book: 'במדבר' },
  { id: 'korach', name: 'קֹרַח', nameEn: 'Korach', book: 'במדבר' },
  { id: 'chukat', name: 'חֻקַּת', nameEn: 'Chukat', book: 'במדבר' },
  { id: 'balak', name: 'בָּלָק', nameEn: 'Balak', book: 'במדבר' },
  { id: 'pinchas', name: 'פִּינְחָס', nameEn: 'Pinchas', book: 'במדבר' },
  { id: 'matot', name: 'מַּטּוֹת', nameEn: 'Matot', book: 'במדבר' },
  { id: 'masei', name: 'מַסְעֵי', nameEn: 'Masei', book: 'במדבר' },
  
  // Devarim (Deuteronomy)
  { id: 'devarim', name: 'דְּבָרִים', nameEn: 'Devarim', book: 'דברים' },
  { id: 'vaetchanan', name: 'וָאֶתְחַנַּן', nameEn: 'Vaetchanan', book: 'דברים' },
  { id: 'eikev', name: 'עֵקֶב', nameEn: 'Eikev', book: 'דברים' },
  { id: 'reeh', name: 'רְאֵה', nameEn: 'Re\'eh', book: 'דברים' },
  { id: 'shoftim', name: 'שֹׁפְטִים', nameEn: 'Shoftim', book: 'דברים' },
  { id: 'ki_teitzei', name: 'כִּי תֵצֵא', nameEn: 'Ki Teitzei', book: 'דברים' },
  { id: 'ki_tavo', name: 'כִּי תָבוֹא', nameEn: 'Ki Tavo', book: 'דברים' },
  { id: 'nitzavim', name: 'נִצָּבִים', nameEn: 'Nitzavim', book: 'דברים' },
  { id: 'vayeilech', name: 'וַיֵּלֶךְ', nameEn: 'Vayeilech', book: 'דברים' },
  { id: 'haazinu', name: 'הַאֲזִינוּ', nameEn: 'Ha\'Azinu', book: 'דברים' },
  { id: 'vzot_haberachah', name: 'וְזֹאת הַבְּרָכָה', nameEn: 'V\'Zot HaBerachah', book: 'דברים' }
];

/**
 * Load a specific parsha by ID
 */
export async function loadParsha(parshaId: string): Promise<Parsha | null> {
  try {
    console.log(`🔍 Loading parsha: ${parshaId}`);
    // Use dynamic import for the registry to avoid loading all parshiot upfront
    const { parshiotRegistry } = await import('../content/parshiot-index');
    console.log(`📚 Registry keys:`, Object.keys(parshiotRegistry));
    const parsha = parshiotRegistry[parshaId];
    
    if (!parsha) {
      console.error(`❌ Parsha ${parshaId} not found in registry`);
      console.error(`Available keys:`, Object.keys(parshiotRegistry));
      return null;
    }
    
    console.log(`✅ Parsha ${parshaId} loaded successfully`);
    return parsha;
  } catch (error) {
    console.error(`💥 Error loading parsha ${parshaId}:`, error);
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
 * Get the current week's parsha
 * Uses a known date as reference: Sept 28, 2024 was Parshat Bereishit
 * (adjusted to align with actual Torah reading cycle)
 */
export function getCurrentParsha(): typeof PARSHIOT_LIST[0] | null {
  try {
    // Reference: Sept 28, 2024 adjusted to align with Feb 4, 2026 = Yitro (index 16)
    const referenceDate = new Date('2024-09-28');
    const now = new Date();
    
    // Calculate weeks since reference date
    const diffTime = now.getTime() - referenceDate.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    // Cycle through the parshiot (54 weeks in a cycle)
    const parshaIndex = diffWeeks % PARSHIOT_LIST.length;
    return PARSHIOT_LIST[parshaIndex];
  } catch (error) {
    console.error('Error getting current parsha:', error);
    // Fallback to Bereishit
    return PARSHIOT_LIST[0];
  }
}
