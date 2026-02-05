// Setup file for Jest tests
// import '@testing-library/react-native/extend-expect';

// Disable Expo's winter import meta registry during tests
global.__ExpoImportMetaRegistry = undefined;
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

// Set up Platform before any modules load
const PlatformMock = {
  OS: 'ios',
  select: (obj) => obj.ios || obj.default,
  isPad: false,
  isTV: false,
  isTesting: true,
};

// Mock both possible Platform imports
jest.mock('react-native/Libraries/Utilities/Platform', () => PlatformMock);
jest.doMock('react-native', () => ({
  Platform: PlatformMock,
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
  },
  // Add other minimal React Native mocks if needed
}), { virtual: false });

// Mock chapter content for tests - must be before contentLoader import
const mockChapterRegistry = {
  'kitzur_orach_chaim-001': {
    id: 'kitzur_orach_chaim-001',
    chapterLabel: 'פרק א',
    title: 'הלכות השכמת הבוקר',
    category: 'אורח חיים',
    sections: [
      { id: 'section-1', section: 1, text: 'צריך להתגבר כארי לעמוד בבוקר לעבודת בוראו' },
      { id: 'section-2', section: 2, text: 'כשמתלבש יכוון שהוא מתעטף במצוות' }
    ],
    version: 1
  },
  'kitzur_orach_chaim-002': {
    id: 'kitzur_orach_chaim-002',
    chapterLabel: 'פרק ב',
    title: 'סדר נטילת ידים ברכת המוציא',
    category: 'אורח חיים',
    sections: [
      { id: 'section-1', section: 1, text: 'נטילת ידים שחרית' }
    ],
    version: 1
  }
};

jest.mock('../content/chapters-index', () => ({
  default: mockChapterRegistry
}), { virtual: true });

// Mock chapter IDs
jest.mock('../content/chapter-ids-only', () => ({
  chapterIds: ['kitzur_orach_chaim-001', 'kitzur_orach_chaim-002']
}), { virtual: true });

// Mock AsyncStorage with a working implementation
const mockAsyncStorage = (() => {
  let store = {};
  
  return {
    setItem: jest.fn(async (key, value) => {
      store[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn(async (key) => {
      return Promise.resolve(store[key] || null);
    }),
    removeItem: jest.fn(async (key) => {
      delete store[key];
      return Promise.resolve();
    }),
    multiRemove: jest.fn(async (keys) => {
      keys.forEach(key => delete store[key]);
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(async () => {
      return Promise.resolve(Object.keys(store));
    }),
    clear: jest.fn(async () => {
      store = {};
      return Promise.resolve();
    }),
    multiSet: jest.fn(async (keyValuePairs) => {
      keyValuePairs.forEach(([key, value]) => {
        store[key] = value;
      });
      return Promise.resolve();
    }),
    multiGet: jest.fn(async (keys) => {
      return Promise.resolve(keys.map(key => [key, store[key] || null]));
    }),
  };
})();

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: 'Screen',
  },
  Tabs: {
    Screen: 'Screen',
  },
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useFocusEffect: jest.fn(),
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: 'Svg',
    Svg: 'Svg',
    Circle: 'Circle',
    Rect: 'Rect',
    Path: 'Path',
    G: 'G',
    Text: 'Text',
    Defs: 'Defs',
    LinearGradient: 'LinearGradient',
    Stop: 'Stop',
  };
});

// Mock hooks - use @ alias
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('@/contexts/AppContext', () => ({
  useAppContext: jest.fn(() => ({
    fontSize: 16,
    setFontSize: jest.fn(),
  })),
}));

// Mock expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
  getStringAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));

// Mock react-native modules
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
