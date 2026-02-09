// app.config.js - Dynamic Expo configuration with environment variables
// This allows us to inject environment variables at build time

const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? '🧪 קיצור (Dev)' : 'למען שמו באהבה',
    slug: 'kitzur-shulchan-aruch',
    version: '1.4.0',
    description:
      'אפליקציה לימודית שיתופית ללימוד תנ"ך, הלכות וברכות. כוללת קיצור שולחן ערוך, שולחן ערוך מלא, פרשת השבוע, ומערכת שאלות ותשובות קהילתית להלכה ולימוד התורה הקדושה.',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'kitzur',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    primaryColor: '#007AFF',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yalkutyosef.kitzur',
      buildNumber: '4',
      infoPlist: {
        CFBundleLocalizations: ['he', 'en'],
        NSPhotoLibraryUsageDescription: 'This app does not access your photos.',
        NSCameraUsageDescription: 'This app does not use the camera.',
      },
    },
    android: {
      package: 'com.yalkutyosef.kitzur',
      versionCode: 4,
      adaptiveIcon: {
        backgroundColor: '#007AFF',
        foregroundImage: './assets/images/android-icon-foreground.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ['INTERNET', 'ACCESS_NETWORK_STATE'],
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      // Firebase configuration from environment variables
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      
      // Admin authentication
      adminSecretCode: process.env.EXPO_PUBLIC_ADMIN_SECRET_CODE,
      
      // EAS Update configuration (for future use)
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  },
};
