/**
 * Design System for Kitzur Learning App
 * Navy + Bronze + Teal color palette with comprehensive design tokens
 */

import { Platform } from 'react-native';

type ColorPalette = {
  light: {
    primary: {
      main: string;
      light: string;
      dark: string;
    };
    secondary: {
      main: string;
      light: string;
    };
    accent: {
      main: string;
      light: string;
      bronze: string;
      teal: string;
    };
    background: {
      base: string;
      surface: string;
    };
    surface: {
      card: string;
    };
    text: {
      primary: string;
      secondary: string;
      onPrimary: string;
    };
    border: {
      default: string;
      focus: string;
    };
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  dark: {
    primary: {
      main: string;
      light: string;
      dark: string;
    };
    secondary: {
      main: string;
      light: string;
    };
    accent: {
      main: string;
      light: string;
      bronze: string;
      teal: string;
    };
    background: {
      base: string;
      surface: string;
    };
    surface: {
      card: string;
    };
    text: {
      primary: string;
      secondary: string;
      onPrimary: string;
    };
    border: {
      default: string;
      focus: string;
    };
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
};

export const Colors: ColorPalette = {
  light: {
    primary: {
      main: '#4A90E2',      // כחול תכלת מודרני
      light: '#74B9FF',      // תכלת בהיר
      dark: '#2C5FFE',       // כחול עמוק
    },
    secondary: {
      main: '#B394E8',       // סגול עדין
      light: '#DDA0DD',      // פלאם עדין
    },
    accent: {
      main: '#00D2D3',       // תכלת נוצץ
      light: '#98FB98',      // מינט עדין
      bronze: '#20B2AA',     // ירוק-תכלת
      teal: '#E6E6FA',       // לבנדר עדין
    },
    background: {
      base: '#FAFBFF',       // לבן עם גוון כחלחל
      surface: '#FFFFFF',
    },
    surface: {
      card: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',    // כחול כהה כמעט שחור
      secondary: '#5D6D9E',  // כחול אפור
      onPrimary: '#FFFFFF',
    },
    border: {
      default: '#E0E8FF',    // כחלחל עדין לגבולות
      focus: '#4A90E2',      // כחול תכלת לפוקוס
    },
    semantic: {
      success: '#20B2AA',    // ירוק-תכלת
      warning: '#FF8C00',    // כתום עדין
      error: '#FF6B6B',      // אדום עדין
      info: '#4A90E2',       // כחול תכלת
    },
  },
  dark: {
    primary: {
      main: '#6FAF8A',       // ירוק זית בהיר (dark mode)
      light: '#8FC9A6',      // ירוק בהיר יותר
      dark: '#4A8A6A',       // ירוק כהה
    },
    secondary: {
      main: '#E5C869',       // זהב חם (dark mode)
      light: '#F5D89A',      // זהב בהיר
    },
    accent: {
      main: '#5BA3D0',       // כחול מזרחי בהיר
      light: '#89C2E3',      // כחול בהיר מאוד
      bronze: '#B394E8',     // סגול רך
      teal: '#5FD2C8',       // טורקיז (שמור)
    },
    background: {
      base: '#0E1220',       // כהה
      surface: '#171C2A',    // כהה בהיר
    },
    surface: {
      card: '#1F2937',
    },
    text: {
      primary: '#F5F7FA',
      secondary: '#A0A7B3',
      onPrimary: '#0E1220',
    },
    border: {
      default: '#24314A',
      focus: '#6FAF8A',      // ירוק לפוקוס
    },
    semantic: {
      success: '#6FAF8A',    // ירוק זית בהיר
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#5BA3D0',       // כחול מזרחי
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontSize: {
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 17,
    bodyLarge: 18,
    bodySmall: 15,
    caption: 13,
    overline: 11,
  },
  lineHeight: {
    tight: 1.2,
    body: 1.6,
    relaxed: 1.8,
  },
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
