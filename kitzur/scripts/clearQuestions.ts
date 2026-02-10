/**
 * Clear all questions from Firebase and Local Storage
 * Run with: npx ts-node scripts/clearQuestions.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase configuration
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
const db = getFirestore(app);

async function clearAllQuestions() {
  try {
    console.log('🗑️  Starting to delete all questions from Firebase...');
    
    const questionsRef = collection(db, 'questions');
    const snapshot = await getDocs(questionsRef);
    
    console.log(`📊 Found ${snapshot.size} questions to delete`);
    
    let deletedCount = 0;
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, 'questions', document.id));
      deletedCount++;
      console.log(`✅ Deleted question ${deletedCount}/${snapshot.size}: ${document.id}`);
    }
    
    console.log(`\n🎉 Successfully deleted ${deletedCount} questions!`);
    console.log('✨ Database is now empty and ready for testing from scratch.\n');
    
  } catch (error) {
    console.error('❌ Error deleting questions:', error);
    throw error;
  }
}

// Run the script
clearAllQuestions()
  .then(() => {
    console.log('Done! You can now test with a fresh database.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
