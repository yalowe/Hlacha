import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getFirebaseStatus, migrateToFirebase } from '@/utils/questionsWrapper';
import { getAllQuestions } from '@/utils/questionsManager';

export default function FirebaseSetupScreen() {
  const router = useRouter();
  const [status, setStatus] = useState({ configured: false, message: '' });
  const [localQuestionsCount, setLocalQuestionsCount] = useState(0);
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    const firebaseStatus = getFirebaseStatus();
    setStatus(firebaseStatus);

    const questions = await getAllQuestions();
    setLocalQuestionsCount(questions.length);
  }

  async function handleMigrate() {
    if (localQuestionsCount === 0) {
      Alert.alert('אין שאלות', 'אין שאלות מקומיות להעברה');
      return;
    }

    Alert.alert(
      'העברה לענן',
      `האם להעביר ${localQuestionsCount} שאלות מקומיות ל-Firebase?`,
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'העבר',
          onPress: async () => {
            setMigrating(true);
            const result = await migrateToFirebase();
            setMigrating(false);

            if (result.success) {
              Alert.alert('✅ הצלחה', result.message);
              await loadStatus();
            } else {
              Alert.alert('❌ שגיאה', result.message);
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.title}>הגדרות Firebase</Text>
      </View>

      {/* Status Card */}
      <View style={[styles.card, status.configured ? styles.cardSuccess : styles.cardWarning]}>
        <Ionicons
          name={status.configured ? 'cloud-done' : 'cloud-offline'}
          size={48}
          color={status.configured ? '#4CAF50' : '#FF9800'}
        />
        <Text style={styles.statusMessage}>{status.message}</Text>
      </View>

      {/* Instructions */}
      {!status.configured && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📝 הוראות הגדרה</Text>
          <Text style={styles.instruction}>
            1. גש ל-Firebase Console:{'\n'}
            <Text style={styles.link}>https://console.firebase.google.com</Text>
          </Text>
          <Text style={styles.instruction}>
            2. לחץ &quot;Add project&quot; ותן שם: &quot;Hlacha-App&quot;
          </Text>
          <Text style={styles.instruction}>
            3. בהגדרות הפרויקט, לחץ על אייקון Web {`</>`}
          </Text>
          <Text style={styles.instruction}>
            4. העתק את ה-firebaseConfig והדבק בקובץ:{'\n'}
            <Text style={styles.code}>config/firebase.ts</Text>
          </Text>
          <Text style={styles.instruction}>
            5. בFirebase Console, צור Firestore Database:{'\n'}
            - לחץ &quot;Firestore Database&quot;{'\n'}
            - &quot;Create database&quot;{'\n'}
            - בחר &quot;Start in test mode&quot;{'\n'}
            - בחר Location: europe-west
          </Text>
        </View>
      )}

      {/* Local Questions */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💾 שאלות מקומיות</Text>
        <Text style={styles.count}>{localQuestionsCount} שאלות</Text>

        {status.configured && localQuestionsCount > 0 && (
          <Pressable
            style={[styles.button, migrating && styles.buttonDisabled]}
            onPress={handleMigrate}
            disabled={migrating}
          >
            {migrating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color="#FFF" />
                <Text style={styles.buttonText}>העבר לענן</Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* Help Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💡 למה Firebase?</Text>
        <Text style={styles.helpText}>
          ✅ סינכרון בזמן אמת בין מכשירים{'\n'}
          ✅ גיבוי אוטומטי בענן{'\n'}
          ✅ שיתוף שאלות עם כל המשתמשים{'\n'}
          ✅ עבודה גם בלי אינטרנט (offline)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  card: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSuccess: {
    backgroundColor: '#E8F5E9',
  },
  cardWarning: {
    backgroundColor: '#FFF3E0',
  },
  statusMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  instruction: {
    fontSize: 14,
    lineHeight: 24,
    color: '#666',
    marginBottom: 12,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#F0F0F0',
    padding: 4,
    borderRadius: 4,
  },
  count: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
    marginVertical: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
});
