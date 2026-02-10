/**
 * Answer Question Screen
 * Allows anyone from the community to answer a question with halachic sources
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TextInput, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { getAllQuestions, answerQuestion } from '@/utils/questionsWrapper';
import type { Question, HalachicSource } from '@/types/questions';

export default function AnswerQuestionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [sourceBook, setSourceBook] = useState('');
  const [sourceSiman, setSourceSiman] = useState('');
  const [sourceSeif, setSourceSeif] = useState('');
  const [sourceDetails, setSourceDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [id]);

  async function loadQuestion() {
    if (!id) return;
    
    setLoading(true);
    try {
      const questions = await getAllQuestions();
      const found = questions.find(q => q.id === id);
      if (found) {
        setQuestion(found);
      }
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  }

  function validateAnswer(): boolean {
    if (!answerText.trim()) {
      Alert.alert('❌ שגיאה', 'חובה להזין תשובה');
      return false;
    }
    if (answerText.length < 20) {
      Alert.alert('❌ שגיאה', 'התשובה קצרה מדי (מינימום 20 תווים)');
      return false;
    }
    if (!sourceBook.trim()) {
      Alert.alert('❌ שגיאה', 'חובה להזין מקור - ספר הלכתי');
      return false;
    }
    if (!sourceSiman.trim()) {
      Alert.alert('❌ שגיאה', 'חובה להזין מספר סימן במקור');
      return false;
    }
    
    return true;
  }

  async function handleSubmit() {
    if (!validateAnswer() || !question) return;

    try {
      setSubmitting(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      // Create the halachic source
      const source: HalachicSource = {
        book: sourceBook.trim(),
        siman: sourceSiman.trim(),
        seif: sourceSeif.trim() || undefined,
        quote: sourceDetails.trim() || undefined,
      };

      // Submit answer using the wrapper (will handle Firebase/AsyncStorage automatically)
      await answerQuestion(
        id,
        answerText.trim(),
        [source],
        'user_' + Date.now(), // Simple user ID
        'משתמש מהקהילה',
        'community'
      );

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        '✅ התשובה נשלחה!',
        'תודה רבה על תרומתך! התשובה שלך פורסמה ומופיעה עכשיו בשאלה.',
        [
          {
            text: 'צפה בשאלה',
            onPress: () => {
              router.back();
              setTimeout(() => router.push(`/question/${id}`), 100);
            }
          },
          {
            text: 'הוסף תשובה נוספת',
            onPress: () => {
              setAnswerText('');
              setSourceBook('');
              setSourceSiman('');
              setSourceSeif('');
              setSourceDetails('');
            }
          },
          {
            text: 'חזור',
            onPress: () => router.back(),
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Failed to submit answer:', error);
      Alert.alert('❌ שגיאה', 'לא הצלחנו לשמור את התשובה. נסה שוב.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !question) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ActivityIndicator size="large" color={colors.primary.main} style={{ marginTop: 100 }} />
      </ThemedView>
    );
  }

  const characterCount = answerText.length;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Instructions */}
        <View style={[styles.infoBox, { backgroundColor: colors.primary.light }]}>
          <Ionicons name="information-circle" size={20} color={colors.primary.main} />
          <ThemedText style={[styles.infoText, { color: colors.text.primary }]}>
            כל תשובה חייבת להיות מבוססת על מקורות הלכתיים. התשובה תפורסם מיידית.
          </ThemedText>
        </View>

        {/* Question Display */}
        <View style={[styles.questionBox, { backgroundColor: colors.surface.card }]}>
          <ThemedText style={[styles.questionLabel, { color: colors.text.secondary }]}>
            ❓ השאלה:
          </ThemedText>
          <ThemedText style={[styles.questionText, { color: colors.text.primary }]}>
            {question.question}
          </ThemedText>
        </View>

        {/* Answer Input */}
        <View style={styles.section}>
          <ThemedText style={[styles.label, { color: colors.text.primary }]}>
            💡 התשובה שלך *
          </ThemedText>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: colors.surface.card,
                color: colors.text.primary,
                borderColor: colors.border.default
              }
            ]}
            placeholder="הזן תשובה מפורטת עם הסבר הלכתי ברור..."
            placeholderTextColor={colors.text.secondary}
            value={answerText}
            onChangeText={setAnswerText}
            multiline
            numberOfLines={8}
            textAlign="right"
            textAlignVertical="top"
          />
          <View style={styles.charCountRow}>
            <ThemedText style={[
              styles.charCount, 
              { color: characterCount >= 20 ? colors.semantic.success : colors.text.secondary }
            ]}>
              {characterCount} / מינימום 20 תווים
            </ThemedText>
          </View>
        </View>

        {/* Halachic Sources - REQUIRED */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text.primary }]}>
            📚 מקורות הלכתיים (חובה!)
          </ThemedText>
          <ThemedText style={[styles.requirementText, { color: colors.semantic.error }]}>
            ⚠️ כל תשובה חייבת להיות מבוססת על מקור הלכה למעשה
          </ThemedText>

          {/* Book Name */}
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: colors.text.primary }]}>
              📖 ספר *
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surface.card,
                  color: colors.text.primary,
                  borderColor: colors.border.default
                }
              ]}
              placeholder="לדוגמה: שולחן ערוך, משנה ברורה, כף החיים..."
              placeholderTextColor={colors.text.secondary}
              value={sourceBook}
              onChangeText={setSourceBook}
              textAlign="right"
            />
          </View>

          {/* Siman & Seif */}
          <View style={styles.row}>
            <View style={[styles.halfWidth, { marginLeft: spacing.sm }]}>
              <ThemedText style={[styles.label, { color: colors.text.primary }]}>
                📖 סימן *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surface.card,
                    color: colors.text.primary,
                    borderColor: colors.border.default
                  }
                ]}
                placeholder="מספר סימן"
                placeholderTextColor={colors.text.secondary}
                value={sourceSiman}
                onChangeText={setSourceSiman}
                textAlign="right"
              />
            </View>

            <View style={styles.halfWidth}>
              <ThemedText style={[styles.label, { color: colors.text.primary }]}>
                📜 סעיף
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surface.card,
                    color: colors.text.primary,
                    borderColor: colors.border.default
                  }
                ]}
                placeholder="אופציונלי"
                placeholderTextColor={colors.text.secondary}
                value={sourceSeif}
                onChangeText={setSourceSeif}
                textAlign="right"
              />
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.inputGroup}>
            <ThemedText style={[styles.label, { color: colors.text.primary }]}>
              📝 ציטוט/פרטים נוספים (אופציונלי)
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surface.card,
                  color: colors.text.primary,
                  borderColor: colors.border.default
                }
              ]}
              placeholder="לדוגמה: 'וכתב המשנה ברורה...' או 'סעיף קטן ה'"
              placeholderTextColor={colors.text.secondary}
              value={sourceDetails}
              onChangeText={setSourceDetails}
              textAlign="right"
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary.main },
              submitting && { opacity: 0.6 }
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="send" size={24} color="#FFFFFF" />
                <ThemedText style={styles.submitButtonText}>
                  שלח תשובה לבדיקה
                </ThemedText>
              </>
            )}
          </Pressable>

          <ThemedText style={[styles.disclaimerText, { color: colors.text.secondary }]}>
            התשובה תעבור בדיקה לפני פרסום כדי לוודא דיוק הלכתי
          </ThemedText>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  infoBox: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  questionBox: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  requirementText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'right',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  input: {
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  textArea: {
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    textAlign: 'right',
    minHeight: 150,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  charCountRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  charCount: {
    fontSize: 12,
  },
  submitSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
