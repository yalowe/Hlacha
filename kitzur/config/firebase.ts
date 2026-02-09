/**
 * Firebase Configuration
 * Setup Firestore for collaborative Torah learning platform
 * 
 * Handles:
 * - Questions & Answers database (Halacha and Torah study)
 * - User authentication for community features
 * - Shared learning content and progress
 * 
 * Configuration is loaded from environment variables for security.
 * See .env.example for required variables.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

// Get Firebase config from environment variables
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && 
                             firebaseConfig.projectId && 
                             !firebaseConfig.apiKey.includes('YOUR_');

// Initialize Firebase only if properly configured
let app;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.info('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
} else {
  console.warn('⚠️ Firebase not configured. Questions & Answers feature will not work.');
  console.warn('   Please set up Firebase environment variables in .env file.');
}

export { db, auth };

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create Firebase Project:
 *    - Go to https://console.firebase.google.com
 *    - Click "Add project"
 *    - Name: "Torah Learning App" or "למען שמו באהבה" (your choice)
 *    - Enable Google Analytics (optional)
 * 
 * 2. Add Web App:
 *    - In Project Overview, click "Web" icon (</>)
 *    - Register app name: "Torah Learning Web"
 *    - Copy the config object and add to .env file
 * 
 * 3. Create Firestore Database:
 *    - In Firebase Console, go to "Firestore Database"
 *    - Click "Create database"
 *    - Start in "production mode" (we'll add security rules)
 *    - Choose location: europe-west (or closest to Israel)
 * 
 * 4. Set Security Rules:
 *    Go to Firestore > Rules and paste:
 * 
 *    rules_version = '2';
 *    service cloud.firestore {
 *      match /databases/{database}/documents {
 *        // Questions collection - anyone can read, authenticated can write
 *        match /questions/{questionId} {
 *          allow read: if true;
 *          allow create: if request.auth != null;
 *          allow update: if request.auth != null;
 *          allow delete: if request.auth.uid == resource.data.askedBy;
 *        }
 *        
 *        // Answers subcollection - only authenticated users
 *        match /questions/{questionId}/answers/{answerId} {
 *          allow read: if true;
 *          allow write: if request.auth != null;
 *        }
 *      }
 *    }
 * 
 * 5. Enable Authentication (Optional):
 *    - Go to Authentication > Get started
 *    - Enable "Anonymous" provider (for now)
 *    - Later: enable Email/Google for user accounts
 * 
 * 6. Install Firebase:
 *    npm install firebase
 * 
 * 7. Uncomment the imports and initialization code above
 * 
 * 8. Test connection:
 *    - Run the app
 *    - Check Firebase Console > Firestore for new data
 */
