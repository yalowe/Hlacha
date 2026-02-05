/**
 * Ask Question Screen
 * Form for submitting new questions to community
 */
import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { askQuestion } from '@/utils/questionsManager';
import { CATEGORY_LABELS } from '@/types/questions';
import type { QuestionCategory } from '@/types/questions';
import * as Haptics from 'expo-haptics';

export default function AskQuestionScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [questionText, setQuestionText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('other');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!questionText.trim()) {
      Alert.alert('❌ שגיאה', 'נא להזין שאלה');
      return;
    }

    if (questionText.trim().length < 10) {
      Alert.alert('❌ שגיאה', 'השאלה קצרה מדי. נא להרחיב מעט');
      return;
    }

    try {
      setSubmitting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const newQuestion = await askQuestion(
        questionText.trim(),
        selectedCategory,
        'user_' + Date.now(), // Simple user ID for now
        'משתמש',
        isPrivate
      );

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        '✅ השאלה נשלחה',
        'השאלה שלך התקבלה ותענה בהקדם',
        [
          {
            text: 'צפה בשאלה',
            onPress: () => {
              router.back();
              router.push(`/question/${newQuestion.id}`);
            }
          },
          {
            text: 'אישור',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Failed to submit question:', error);
      Alert.alert('❌ שגיאה', 'לא ניתן לשלוח את השאלה כרגע');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  }

  const categories = Object.entries(CATEGORY_LABELS);
  const characterCount = questionText.length;
  const isValid = characterCount >= 10 && characterCount <= 500;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="close" size={28} color={colors.text.primary} />
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: colors.text.primary }]}>
            ❓ שאל שאלה חדשה
          </ThemedText>
          <View style={{ width: 28 }} />
        </View>

        {/* Instructions */}
        <View style={[styles.infoBox, { backgroundColor: colors.primary.light }]}>
          <Ionicons name="information-circle" size={20} color={colors.primary.main} />
          <ThemedText style={[styles.infoText, { color: colors.text.primary }]}>
            שאל שאלה הלכתית ותקבל תשובה מבוססת מקורות מרב מוסמך
          </ThemedText>
        </View>

        {/* Question Input */}
        <View style={styles.section}>
          <ThemedText style={[styles.label, { color: colors.text.primary }]}>
            📝 השאלה שלך
          </ThemedText>
          <View style={[
            styles.inputContainer, 
            { 
              backgroundColor: colors.surface.card,
              borderColor: !isValid && characterCount > 0 ? Colors.light.semantic.error : 'transparent'
            }
          ]}>
            <TextInput
              style={[styles.textArea, { color: colors.text.primary }]}
              placeholder="פרט את השאלה שלך בבהירות..."
              placeholderTextColor={colors.text.secondary}
              value={questionText}
              onChangeText={setQuestionText}
              multiline
              numberOfLines={6}
              maxLength={500}
              textAlign="right"
            />
          </View>
          <View style={styles.characterCount}>
            <ThemedText style={[
              styles.countText, 
              { color: isValid ? colors.text.secondary : Colors.light.semantic.error }
            ]}>
              {characterCount}/500 {characterCount < 10 && '(מינימום 10 תווים)'}
            </ThemedText>
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <ThemedText style={[styles.label, { color: colors.text.primary }]}>
            📚 קטגוריה
          </ThemedText>
          <View style={styles.categoriesGrid}>
            {categories.map(([key, label]) => {
              const isSelected = selectedCategory === key;
              return (
                <Pressable
                  key={key}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: colors.surface.card },
                    isSelected && { 
                      backgroundColor: colors.primary.main,
                      borderWidth: 2,
                      borderColor: colors.primary.dark
                    }
                  ]}
                  onPress={() => {
                    setSelectedCategory(key as QuestionCategory);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <ThemedText style={[
                    styles.categoryOptionText,
                    { color: isSelected ? colors.text.onPrimary : colors.text.primary }
                  ]}>
                    {label}
                  </ThemedText>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.text.onPrimary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Privacy Toggle */}
        <View style={styles.section}>
          <Pressable
            style={[styles.privacyToggle, { backgroundColor: colors.surface.card }]}
            onPress={() => {
              setIsPrivate(!isPrivate);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.privacyLeft}>
              <Ionicons 
                name={isPrivate ? "lock-closed" : "globe"} 
                size={20} 
                color={colors.text.primary} 
              />
              <View style={styles.privacyText}>
                <ThemedText style={[styles.privacyTitle, { color: colors.text.primary }]}>
                  {isPrivate ? '🔒 שאלה פרטית' : '🌍 שאלה ציבורית'}
                </ThemedText>
                <ThemedText style={[styles.privacySubtitle, { color: colors.text.secondary }]}>
                  {isPrivate 
                    ? 'רק אתה ורבנים יראו את השאלה'
                    : 'כל המשתמשים יראו ויוכלו ללמוד מהתשובה'
                  }
                </ThemedText>
              </View>
            </View>
            <View style={[
              styles.toggle,
              { backgroundColor: isPrivate ? colors.primary.main : colors.text.secondary }
            ]}>
              <View style={[
                styles.toggleCircle,
                { backgroundColor: '#FFFFFF' },
                isPrivate && styles.toggleCircleActive
              ]} />
            </View>
          </Pressable>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: colors.accent.bronze },
              (!isValid || submitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <>
                <Ionicons name="hourglass" size={24} color="#FFFFFF" />
                <ThemedText style={styles.submitButtonText}>
                  שולח...
                </ThemedText>
              </>
            ) : (
              <>
                <Ionicons name="send" size={24} color="#FFFFFF" />
                <ThemedText style={styles.submitButtonText}>
                  שלח שאלה
                </ThemedText>
              </>
            )}
          </Pressable>
        </View>

        {/* Tips */}
        <View style={[styles.tipsBox, { backgroundColor: colors.surface.card }]}>
          <ThemedText style={[styles.tipsTitle, { color: colors.text.primary }]}>
            💡 טיפים לשאלה טובה:
          </ThemedText>
          <ThemedText style={[styles.tipItem, { color: colors.text.secondary }]}>
            • פרט את הנסיבות והשאלה בצורה ברורה
          </ThemedText>
          <ThemedText style={[styles.tipItem, { color: colors.text.secondary }]}>
            • ציין פרטים רלוונטיים (זמן, מקום, נוהג וכו')
          </ThemedText>
          <ThemedText style={[styles.tipItem, { color: colors.text.secondary }]}>
            • בחר את הקטגוריה המתאימה ביותר
          </ThemedText>
          <ThemedText style={[styles.tipItem, { color: colors.text.secondary }]}>
            • שאלות ציבוריות עוזרות לכל הקהילה!
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  inputContainer: {
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 2,
  },
  textArea: {
    fontSize: 16,
    textAlign: 'right',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  countText: {
    fontSize: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    minWidth: '30%',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  privacyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
  },
  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  privacySubtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  tipsBox: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.md,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  tipItem: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
});
