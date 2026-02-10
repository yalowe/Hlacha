import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { seedQuestions } from '@/scripts/seed-questions';

export default function DevToolsScreen() {
  const router = useRouter();

  const handleSeedQuestions = async () => {
    try {
      const success = await seedQuestions();
      if (success) {
        Alert.alert(
          '✅ הצלחה!',
          'נוספו 6 שאלות לדוגמה למערכת.\n\nגש למסך "שאלות ותשובות" כדי לראות אותן.',
          [
            {
              text: 'סגור',
              style: 'cancel',
            },
            {
              text: 'לשאלות',
              onPress: () => router.push('/questions'),
            },
          ]
        );
      } else {
        Alert.alert('❌ שגיאה', 'משהו השתבש בטעינת השאלות');
      }
    } catch (error) {
      Alert.alert('❌ שגיאה', error instanceof Error ? error.message : 'שגיאה לא ידועה');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ כלי פיתוח</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>מסד נתונים</Text>
        
        <Pressable style={styles.button} onPress={handleSeedQuestions}>
          <Text style={styles.buttonText}>🌱 טען שאלות לדוגמה</Text>
          <Text style={styles.buttonDescription}>
            הוסף 6 שאלות עם תשובות לבדיקה
          </Text>
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 מסך זה מיועד לבדיקות פיתוח בלבד
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  infoText: {
    color: '#B8860B',
    textAlign: 'center',
    fontSize: 13,
  },
});
