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
      main: '#2D5F3F',      // ירוק זית עמוק - ספרדי/מזרחי
      light: '#5A8A6A',      // ירוק זית בהיר
      dark: '#1A3D28',       // ירוק זית כהה
    },
    secondary: {
      main: '#D4AF37',       // זהב חם - מזרחי
      light: '#E5C869',      // זהב בהיר
    },
    accent: {
      main: '#1B4F72',       // כחול עמוק מזרחי
      light: '#4A7BA7',      // כחול בהיר
      bronze: '#B8860B',     // ברונזה זהובה
      teal: '#2E7D7D',       // טורקיז (שמור)
    },
    background: {
      base: '#F8F5F0',       // שמנת טבעית חמה
      surface: '#FFFFFF',
    },
    surface: {
      card: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4D4D4D',
      onPrimary: '#FFFFFF',
    },
    border: {
      default: '#E6E2DA',
      focus: '#2D5F3F',      // ירוק זית לפוקוס
    },
    semantic: {
      success: '#2D5F3F',    // ירוק זית
      warning: '#D97706',
      error: '#DC2626',
      info: '#1B4F72',       // כחול מזרחי
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
      bronze: '#D4AF37',     // זהב
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
