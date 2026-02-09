/**
 * Pending Answers Screen
 * Review and approve community answers before publishing
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllQuestions } from '@/utils/questionsManager';
import type { Question } from '@/types/questions';

interface PendingAnswer {
  questionId: string;
  text: string;
  sources: {
    book: string;
    siman: string;
    seif?: string;
    quote?: string;
  }[];
  respondedBy: string;
  timestamp: number;
  status: string;
  approvedBy: any[];
}

export default function PendingAnswersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [loading, setLoading] = useState(true);
  const [pendingAnswers, setPendingAnswers] = useState<PendingAnswer[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question>>({});

  useEffect(() => {
    loadPendingAnswers();
  }, []);

  async function loadPendingAnswers() {
    setLoading(true);
    try {
      const PENDING_KEY = '@kitzur_pending_answers';
      const existing = await AsyncStorage.getItem(PENDING_KEY);
      const pending = existing ? JSON.parse(existing) : [];
      setPendingAnswers(pending);

      // Load questions to display them with answers
      const allQuestions = await getAllQuestions();
      const questionMap: Record<string, Question> = {};
      allQuestions.forEach(q => {
        questionMap[q.id] = q;
      });
      setQuestions(questionMap);
    } catch (error) {
      console.error('Failed to load pending answers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(index: number) {
    const answer = pendingAnswers[index];
    const question = questions[answer.questionId];

    if (!question) {
      Alert.alert('❌ שגיאה', 'השאלה לא נמצאה');
      return;
    }

    Alert.alert(
      '✅ אישור תשובה',
      `האם לאשר את התשובה לשאלה:\n\n"${question.question.substring(0, 50)}..."\n\nהתשובה תפורסם באפליקציה.`,
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'אשר',
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

              // Update question with the answer
              const updatedQuestion: Question = {
                ...question,
                answer: {
                  text: answer.text,
                  source: "community",
                  answeredAt: Date.now(),
                  sources: answer.sources,
                  approvals: [],
                  isVerified: true,
                  totalApprovalWeight: 0,
                },
                status: 'verified',
              };

              // Update questions in storage
              const allQuestions = await getAllQuestions();
              const updatedQuestions = allQuestions.map(q => 
                q.id === answer.questionId ? updatedQuestion : q
              );
              await AsyncStorage.setItem('@kitzur_questions', JSON.stringify(updatedQuestions));

              // Remove from pending
              const PENDING_KEY = '@kitzur_pending_answers';
              const updatedPending = pendingAnswers.filter((_, i) => i !== index);
              await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(updatedPending));

              setPendingAnswers(updatedPending);

              Alert.alert('✅ מאושר!', 'התשובה פורסמה בהצלחה');
            } catch (error) {
              console.error('Failed to approve answer:', error);
              Alert.alert('❌ שגיאה', 'לא הצלחנו לאשר את התשובה');
            }
          }
        }
      ]
    );
  }

  async function handleReject(index: number) {
    Alert.alert(
      '❌ דחיית תשובה',
      'האם לדחות את התשובה? פעולה זו לא ניתנת לביטול.',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'דחה',
          style: 'destructive',
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

              // Remove from pending
              const PENDING_KEY = '@kitzur_pending_answers';
              const updatedPending = pendingAnswers.filter((_, i) => i !== index);
              await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(updatedPending));

              setPendingAnswers(updatedPending);

              Alert.alert('✅ נדחה', 'התשובה נמחקה');
            } catch (error) {
              console.error('Failed to reject answer:', error);
              Alert.alert('❌ שגיאה', 'לא הצלחנו לדחות את התשובה');
            }
          }
        }
      ]
    );
  }

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ActivityIndicator size="large" color={colors.primary.main} style={{ marginTop: 100 }} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.onPrimary} />
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: colors.text.onPrimary }]}>
            💡 תשובות ממתינות לאישור
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.text.onPrimary, opacity: 0.9 }]}>
            בדוק ואשר תשובות מהקהילה
          </ThemedText>
        </View>

        {/* Content */}
        {pendingAnswers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color={colors.text.secondary} />
            <ThemedText style={[styles.emptyText, { color: colors.text.secondary }]}>
              אין תשובות ממתינות לאישור
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.text.secondary }]}>
              כל התשובות אושרו! 🎉
            </ThemedText>
          </View>
        ) : (
          <View style={styles.content}>
            <ThemedText style={[styles.countText, { color: colors.text.secondary }]}>
              {pendingAnswers.length} תשובות ממתינות
            </ThemedText>

            {pendingAnswers.map((answer, index) => {
              const question = questions[answer.questionId];
              
              return (
                <View key={index} style={[styles.card, { backgroundColor: colors.surface.card }]}>
                  {/* Question */}
                  <View style={styles.questionSection}>
                    <ThemedText style={[styles.sectionLabel, { color: colors.text.secondary }]}>
                      ❓ השאלה:
                    </ThemedText>
                    {question ? (
                      <ThemedText style={[styles.questionText, { color: colors.text.primary }]}>
                        {question.question}
                      </ThemedText>
                    ) : (
                      <ThemedText style={[styles.questionText, { color: colors.text.secondary }]}>
                        השאלה נמחקה
                      </ThemedText>
                    )}
                  </View>

                  {/* Answer */}
                  <View style={styles.answerSection}>
                    <ThemedText style={[styles.sectionLabel, { color: colors.text.secondary }]}>
                      💡 התשובה:
                    </ThemedText>
                    <ThemedText style={[styles.answerText, { color: colors.text.primary }]}>
                      {answer.text}
                    </ThemedText>
                  </View>

                  {/* Sources */}
                  <View style={styles.sourcesSection}>
                    <ThemedText style={[styles.sectionLabel, { color: colors.text.secondary }]}>
                      📚 מקורות:
                    </ThemedText>
                    {answer.sources.map((source, sIndex) => (
                      <View key={sIndex} style={[styles.sourceCard, { backgroundColor: colors.primary.light }]}>
                        <Ionicons name="book" size={16} color={colors.primary.main} />
                        <View style={styles.sourceDetails}>
                          <ThemedText style={[styles.sourceText, { color: colors.text.primary }]}>
                            {source.book} - סימן {source.siman}
                            {source.seif && ` סעיף ${source.seif}`}
                          </ThemedText>
                          {source.quote && (
                            <ThemedText style={[styles.quoteText, { color: colors.text.secondary }]}>
                              &quot;{source.quote}&quot;
                            </ThemedText>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Metadata */}
                  <View style={styles.metadata}>
                    <ThemedText style={[styles.metadataText, { color: colors.text.secondary }]}>
                      נשלח ב-{new Date(answer.timestamp).toLocaleDateString('he-IL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </ThemedText>
                  </View>

                  {/* Actions */}
                  <View style={styles.actions}>
                    <Pressable
                      style={[styles.approveButton, { backgroundColor: Colors.light.semantic.success }]}
                      onPress={() => handleApprove(index)}
                    >
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      <ThemedText style={styles.buttonText}>אשר</ThemedText>
                    </Pressable>

                    <Pressable
                      style={[styles.rejectButton, { backgroundColor: Colors.light.semantic.error }]}
                      onPress={() => handleReject(index)}
                    >
                      <Ionicons name="close" size={20} color="#FFFFFF" />
                      <ThemedText style={styles.buttonText}>דחה</ThemedText>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: 4,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'right',
  },
  card: {
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionSection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  answerSection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sourcesSection: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  questionText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'right',
  },
  answerText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
  },
  sourceCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.xs,
  },
  sourceDetails: {
    flex: 1,
  },
  sourceText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'right',
  },
  metadata: {
    marginBottom: spacing.md,
  },
  metadataText: {
    fontSize: 11,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: 10,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
