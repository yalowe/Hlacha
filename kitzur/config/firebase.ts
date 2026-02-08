/**
 * Firebase Configuration
 * Setup Firestore for shared questions database
 */

// NOTE: Install firebase first: npm install firebase
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// Firebase configuration from Firebase Console
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
// Uncomment after installing firebase package:
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// Temporary exports (remove after Firebase setup)
export const db = null;
export const auth = null;

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
