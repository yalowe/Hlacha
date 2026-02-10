/**
 * Firebase Configuration
 * Setup Firestore for shared questions database
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyARBRNZ87W29maLQE-34NmjH_fcqIxee5s",
  authDomain: "hlacha-app.firebaseapp.com",
  projectId: "hlacha-app",
  storageBucket: "hlacha-app.firebasestorage.app",
  messagingSenderId: "154296942110",
  appId: "1:154296942110:web:5a595463ed4a89c52e380f",
  measurementId: "G-VN7RNGGZHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence
export const db = getFirestore(app);

// Enable offline persistence (caching)
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Persistence not available in this browser');
    }
  });
} catch (error) {
  console.error('Error enabling persistence:', error);
}

// Initialize Auth (for anonymous users)
export const auth = getAuth(app);

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create Firebase Project:
 *    - Go to https://console.firebase.google.com
 *    - Click "Add project"
 *    - Name: "Kitzur App" (or your choice)
 *    - Enable Google Analytics (optional)
 * 
 * 2. Add Web App:
 *    - In Project Overview, click "Web" icon (</>)
 *    - Register app name: "Kitzur Web"
 *    - Copy the config object and replace firebaseConfig above
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
