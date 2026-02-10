/**
 * Question Detail Screen
 * View question with answer, sources, and approvals
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { 
  getAllQuestions,
  incrementQuestionViews,
  markAsHelpful,
  removeRating,
  calculateTrustScore,
  getUserRating,
  subscribeToQuestions
} from '@/utils/questionsWrapper';
import { getDeviceId } from '@/utils/deviceId';
import { CATEGORY_LABELS, APPROVAL_LABELS } from '@/types/questions';
import type { Question, HalachicSource } from '@/types/questions';
import * as Haptics from 'expo-haptics';

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadQuestion();
      
      // Subscribe to real-time updates
      const unsubscribe = subscribeToQuestions((updatedQuestions) => {
        const found = updatedQuestions.find(q => q.id === id);
        if (found) {
          setQuestion(found);
        }
      });
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [id, userId]);

  async function initializeUser() {
    const deviceId = await getDeviceId();
    setUserId(deviceId);
  }

  async function loadQuestion() {
    if (!id || !userId) return;
    
    setLoading(true);
    try {
      const questions = await getAllQuestions();
      const found = questions.find(q => q.id === id);
      if (found) {
        setQuestion(found);
        await incrementQuestionViews(id);
        
        // Load user's previous rating
        const rating = await getUserRating(id, userId);
        setUserRating(rating);
      }
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkHelpful(isHelpful: boolean) {
    if (!id || !userId) return;
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // If clicking the same rating again, remove it
      if (userRating === isHelpful) {
        // Remove the rating completely
        await removeRating(id, userId, userRating);
        setUserRating(null);
        
        // Reload question to get updated stats
        await loadQuestion();
        
        Alert.alert(
          '🔄 בוטל',
          'דירוגך בוטל'
        );
      } else {
        // Add or change rating
        await markAsHelpful(id, isHelpful, userId, userRating);
        setUserRating(isHelpful);
        
        // Reload question to get updated stats
        await loadQuestion();
        
        Alert.alert(
          '✅ תודה',
          isHelpful ? 'דירוגך נרשם - התשובה עזרה לך!' : 'דירוגך נרשם. נשתדל לשפר'
        );
      }
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to mark helpful:', error);
      Alert.alert('❌ שגיאה', 'לא ניתן לדרג כרגע');
    }
  }

  async function handleSourcePress(source: HalachicSource) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (source.inAppLink) {
      // Navigate to in-app chapter/section
      router.push(source.inAppLink as any);
    } else {
      Alert.alert(
        '📖 מקור הלכתי',
        `${source.book} סימן ${source.siman}${source.seif ? ` סעיף ${source.seif}` : ''}`,
        [{ text: 'אישור' }]
      );
    }
  }

  if (loading || !question) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ActivityIndicator size="large" color={colors.primary.main} style={{ marginTop: 100 }} />
      </ThemedView>
    );
  }

  const trustScore = calculateTrustScore(question);
  const hasAnswer = !!question.answer;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={colors.text.primary} />
          </Pressable>
        </View>

        {/* Question Card */}
        <View style={[styles.questionCard, { backgroundColor: colors.surface.card }]}>
          {/* Category & Stats */}
          <View style={styles.questionMeta}>
            <View style={styles.metaLeft}>
              <ThemedText style={[styles.categoryBadge, { backgroundColor: colors.primary.light }]}>
                {CATEGORY_LABELS[question.category]}
              </ThemedText>
              {question.isPrivate && (
                <View style={styles.privateBadge}>
                  <Ionicons name="lock-closed" size={14} color={colors.text.secondary} />
                  <ThemedText style={[styles.privateText, { color: colors.text.secondary }]}>
                    פרטי
                  </ThemedText>
                </View>
              )}
            </View>
            <View style={styles.statsRow}>
              <Ionicons name="eye-outline" size={16} color={colors.text.secondary} />
              <ThemedText style={[styles.statText, { color: colors.text.secondary }]}>
                {question.stats.views}
              </ThemedText>
            </View>
          </View>

          {/* Question Text */}
          <ThemedText style={[styles.questionTitle, { color: colors.text.primary }]}>
            ❓ השאלה
          </ThemedText>
          <ThemedText style={[styles.questionText, { color: colors.text.primary }]}>
            {question.question}
          </ThemedText>

          {/* Tags */}
          {question.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {question.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.primary.light }]}>
                  <ThemedText style={[styles.tagText, { color: colors.primary.dark }]}>
                    #{tag}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}

          {/* Timestamp */}
          <ThemedText style={[styles.timestamp, { color: colors.text.secondary }]}>
            נשאל ב-{new Date(question.timestamp).toLocaleDateString('he-IL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </ThemedText>
        </View>

        {/* Answer Section */}
        {hasAnswer && question.answer ? (
          <View style={[styles.answerCard, { backgroundColor: colors.surface.card }]}>
            {/* Trust Score */}
            <View style={[
              styles.trustScoreBar,
              { backgroundColor: trustScore > 80 ? Colors.light.semantic.success : colors.accent.bronze }
            ]}>
              <Ionicons 
                name={trustScore > 80 ? "shield-checkmark" : "shield"} 
                size={20} 
                color="#FFFFFF" 
              />
              <ThemedText style={styles.trustScoreText}>
                {trustScore}% אמינות • תשובה מאומתת מהקהילה
              </ThemedText>
            </View>

            {/* Answer Text */}
            <ThemedText style={[styles.answerTitle, { color: colors.text.primary }]}>
              💡 תשובה
            </ThemedText>
            <ThemedText style={[styles.answerText, { color: colors.text.primary }]}>
              {question.answer.text}
            </ThemedText>

            {/* Sources */}
            {question.answer.sources.length > 0 && (
              <View style={styles.sourcesSection}>
                <ThemedText style={[styles.sourcesTitle, { color: colors.text.primary }]}>
                  📚 מקורות הלכתיים
                </ThemedText>
                {question.answer.sources.map((source, index) => (
                  <Pressable
                    key={index}
                    style={[styles.sourceItem, { backgroundColor: colors.background.base }]}
                    onPress={() => handleSourcePress(source)}
                  >
                    <View style={styles.sourceContent}>
                      <Ionicons name="book" size={18} color={colors.primary.main} />
                      <View style={styles.sourceText}>
                        <ThemedText style={[styles.sourceBook, { color: colors.text.primary }]}>
                          {source.book}
                        </ThemedText>
                        <ThemedText style={[styles.sourceRef, { color: colors.text.secondary }]}>
                          סימן {source.siman}{source.seif ? `, סעיף ${source.seif}` : ''}
                        </ThemedText>
                      </View>
                    </View>
                    <Ionicons name="chevron-back" size={18} color={colors.text.secondary} />
                  </Pressable>
                ))}
              </View>
            )}

            {/* Approvals */}
            {question.answer.approvals.length > 0 && (
              <View style={styles.approvalsSection}>
                <ThemedText style={[styles.approvalsTitle, { color: colors.text.primary }]}>
                  ✅ אישורים
                </ThemedText>
                {question.answer.approvals.map((approval, index) => (
                  <View key={index} style={[styles.approvalItem, { backgroundColor: colors.background.base }]}>
                    <View style={styles.approvalLeft}>
                      <View style={[styles.approvalBadge, { backgroundColor: colors.primary.main }]}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                      <View>
                        <ThemedText style={[styles.approvalName, { color: colors.text.primary }]}>
                          {approval.userName}
                        </ThemedText>
                        <ThemedText style={[styles.approvalLevel, { color: colors.text.secondary }]}>
                          {APPROVAL_LABELS[approval.level]}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText style={[styles.approvalDate, { color: colors.text.secondary }]}>
                      {new Date(approval.timestamp).toLocaleDateString('he-IL')}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* Helpful Buttons */}
            <View style={styles.helpfulSection}>
              <ThemedText style={[styles.helpfulQuestion, { color: colors.text.primary }]}>
                התשובה עזרה לך?
              </ThemedText>
              <View style={styles.helpfulButtons}>
                <Pressable
                  style={[
                    styles.helpfulButton,
                    { 
                      backgroundColor: userRating === true ? Colors.light.semantic.success : colors.surface.card,
                      borderColor: Colors.light.semantic.success 
                    }
                  ]}
                  onPress={() => handleMarkHelpful(true)}
                >
                  <Ionicons 
                    name={userRating === true ? "thumbs-up" : "thumbs-up-outline"}
                    size={20} 
                    color={userRating === true ? "#FFFFFF" : Colors.light.semantic.success} 
                  />
                  <ThemedText style={[
                    styles.helpfulButtonText,
                    { color: userRating === true ? "#FFFFFF" : Colors.light.semantic.success }
                  ]}>
                    כן ({question.stats.helpful})
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[
                    styles.helpfulButton,
                    { 
                      backgroundColor: userRating === false ? Colors.light.semantic.error : colors.surface.card,
                      borderColor: Colors.light.semantic.error 
                    }
                  ]}
                  onPress={() => handleMarkHelpful(false)}
                >
                  <Ionicons 
                    name={userRating === false ? "thumbs-down" : "thumbs-down-outline"}
                    size={20} 
                    color={userRating === false ? "#FFFFFF" : Colors.light.semantic.error} 
                  />
                  <ThemedText style={[
                    styles.helpfulButtonText,
                    { color: userRating === false ? "#FFFFFF" : Colors.light.semantic.error }
                  ]}>
                    לא ({question.stats.notHelpful})
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.noAnswerCard, { backgroundColor: colors.surface.card }]}>
            <Ionicons name="hourglass-outline" size={48} color={colors.text.secondary} />
            <ThemedText style={[styles.noAnswerTitle, { color: colors.text.primary }]}>
              ממתינה לתשובה
            </ThemedText>
            <ThemedText style={[styles.noAnswerText, { color: colors.text.secondary }]}>
              השאלה ממתינה לתשובה מהקהילה. יכול לענות כל מי שיש לו מקור הלכה למעשה
            </ThemedText>
            <Pressable
              style={[styles.answerButton, { backgroundColor: colors.primary.main }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/answer-question?id=${id}`);
              }}
            >
              <Ionicons name="create" size={24} color="#FFFFFF" />
              <ThemedText style={styles.answerButtonText}>
                ענה על השאלה
              </ThemedText>
            </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    padding: 4,
  },
  questionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  privateText: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    textAlign: 'right',
  },
  answerCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trustScoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  trustScoreText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  answerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  sourcesSection: {
    marginBottom: spacing.lg,
  },
  sourcesTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  sourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.sm,
  },
  sourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  sourceText: {
    flex: 1,
  },
  sourceBook: {
    fontSize: 14,
    fontWeight: '600',
  },
  sourceRef: {
    fontSize: 12,
    marginTop: 2,
  },
  approvalsSection: {
    marginBottom: spacing.lg,
  },
  approvalsTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  approvalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.sm,
  },
  approvalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  approvalBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvalName: {
    fontSize: 14,
    fontWeight: '600',
  },
  approvalLevel: {
    fontSize: 11,
    marginTop: 2,
  },
  approvalDate: {
    fontSize: 11,
  },
  helpfulSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing.md,
  },
  helpfulQuestion: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  helpfulButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  helpfulButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 2,
  },
  helpfulButtonDisabled: {
    opacity: 0.4,
  },
  helpfulButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noAnswerCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noAnswerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  noAnswerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
