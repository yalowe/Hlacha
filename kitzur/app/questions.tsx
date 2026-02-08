/**
 * Questions & Answers Main Screen
 * Community knowledge base
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { 
  getAllQuestions, 
  getPopularQuestions,
  calculateTrustScore,
  getUnansweredQuestions 
} from '@/utils/questionsManager';
import { CATEGORY_LABELS } from '@/types/questions';
import type { Question, QuestionCategory } from '@/types/questions';
import { normalizeHebrew } from '@/utils/hebrewNormalize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Filter state interface
interface FilterState {
  category: QuestionCategory | 'all';
  showOnlyUnanswered: boolean;
  searchQuery: string;
}

export default function QuestionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);
  const [popularQuestions, setPopularQuestions] = useState<Question[]>([]);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [pendingAnswersCount, setPendingAnswersCount] = useState(0);
  
  // Centralized filter state
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    showOnlyUnanswered: false,
    searchQuery: ''
  });
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadQuestions();
  }, []);
  
  // Reload pending answers count when screen regains focus
  useFocusEffect(
    React.useCallback(() => {
      loadPendingAnswersCount();
    }, [])
  );

  async function loadQuestions() {
    setLoading(true);
    try {
      const [all, popular, unanswered] = await Promise.all([
        getAllQuestions(),
        getPopularQuestions(5),
        getUnansweredQuestions()
      ]);
      
      // Load pending answers count
      await loadPendingAnswersCount();
      
      // Initialize sample data if no questions exist
      // if (all.length === 0) {
      //   await initializeSampleData();
      //   const [newAll, newPopular, newUnanswered] = await Promise.all([
      //     getAllQuestions(),
      //     getPopularQuestions(5),
      //     getUnansweredQuestions()
      //   ]);
      //   setAllQuestions(newAll);
      //   setDisplayedQuestions(newAll);
      //   setPopularQuestions(newPopular);
      //   setUnansweredCount(newUnanswered.length);
      // } else {
      setAllQuestions(all);
      setDisplayedQuestions(all);
      setPopularQuestions(popular);
      setUnansweredCount(unanswered.length);
      setPendingAnswersCount(0);
      // }
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadPendingAnswersCount() {
    try {
      const stored = await AsyncStorage.getItem('@kitzur_pending_answers');
      if (stored) {
        const pending = JSON.parse(stored);
        setPendingAnswersCount(pending.length);
      } else {
        setPendingAnswersCount(0);
      }
    } catch (error) {
      console.error('Failed to load pending answers count:', error);
      setPendingAnswersCount(0);
    }
  }
  
  // Smart fuzzy search with Hebrew support and relevance filtering
  const fuzzySearchQuestions = useCallback((query: string, questions: Question[]): Question[] => {
    if (!query.trim()) return questions;
    
    const normalizedQuery = normalizeHebrew(query).toLowerCase();
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 1); // Ignore single chars
    
    // Minimum score threshold - only show relevant results
    const MIN_SCORE_THRESHOLD = queryWords.length * 3; // Lower threshold for partial word matches
    
    const results = questions
      .map(q => {
        const normalizedQuestion = normalizeHebrew(q.question).toLowerCase();
        const normalizedAnswer = q.answer ? normalizeHebrew(q.answer.text).toLowerCase() : '';
        const normalizedTags = q.tags.map(t => normalizeHebrew(t).toLowerCase());
        
        let score = 0;
        let exactMatches = 0;
        
        queryWords.forEach(word => {
          // Exact word match in question (highest priority - this is what user is looking for)
          const questionWords = normalizedQuestion.split(/\s+/);
          if (questionWords.includes(word)) {
            score += 30; // Highest score for exact match
            exactMatches++;
          } else if (questionWords.some(qw => qw.includes(word) || word.includes(qw))) {
            // Partial word match (e.g., "ברכ" matches "ברכה")
            score += 20;
          } else if (normalizedQuestion.includes(word)) {
            // Substring match anywhere in question
            score += 15;
          }
          
          // Exact match in tags (very relevant - tags describe the question)
          const exactTagMatch = normalizedTags.some(tag => tag === word || tag.split(/\s+/).includes(word));
          if (exactTagMatch) {
            score += 25; // Tags are very relevant
            exactMatches++;
          } else if (normalizedTags.some(tag => tag.includes(word) || word.includes(tag))) {
            // Partial tag match
            score += 18;
          }
          
          // Match in answer (answer should address the question)
          const answerWords = normalizedAnswer.split(/\s+/);
          if (answerWords.includes(word)) {
            score += 15; // Answer relevance
            exactMatches++;
          } else if (answerWords.some(aw => aw.includes(word) || word.includes(aw))) {
            // Partial word match in answer
            score += 12;
          } else if (normalizedAnswer.includes(word)) {
            // Substring in answer
            score += 8;
          }
        });
        
        // Bonus for multiple exact matches (strong indication this is relevant)
        if (exactMatches > 1) {
          score += exactMatches * 5;
        }
        
        return { question: q, score };
      })
      .filter(result => result.score >= MIN_SCORE_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .map(result => result.question);
      
    return results;
  }, []);
  
  // Apply all filters together
  const applyAllFilters = useCallback(() => {
    let filtered = [...allQuestions];
    
    console.log('🔍 ========== FILTERS DEBUG ==========');
    console.log('Total questions:', allQuestions.length);
    console.log('Current filters:', JSON.stringify(filters, null, 2));
    
    // Debug: Show all question categories
    const categoryCounts: Record<string, number> = {};
    allQuestions.forEach(q => {
      categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    });
    console.log('Questions by category:', categoryCounts);
    
    // 1. Category filter
    if (filters.category !== 'all') {
      const beforeCount = filtered.length;
      filtered = filtered.filter(q => {
        const match = q.category === filters.category;
        if (!match) {
          console.log(`❌ Filtered out: ${q.question.substring(0, 50)}... (category: ${q.category})`);
        }
        return match;
      });
      console.log(`📚 Category filter (${filters.category}): ${beforeCount} → ${filtered.length}`);
      
      if (filtered.length === 0) {
        console.warn(`⚠️ No questions found for category: ${filters.category}`);
      }
    }
    
    // 2. Unanswered filter
    if (filters.showOnlyUnanswered) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(q => !q.answer);
      console.log(`⏰ Unanswered filter: ${beforeCount} → ${filtered.length}`);
    }
    
    // 3. Search filter
    if (filters.searchQuery.trim()) {
      const beforeCount = filtered.length;
      filtered = fuzzySearchQuestions(filters.searchQuery, filtered);
      console.log(`🔍 Search filter: ${beforeCount} → ${filtered.length}`);
    }
    
    // 4. Sort: unanswered questions ALWAYS at top
    filtered.sort((a, b) => {
      const aUnanswered = !a.answer ? 1 : 0;
      const bUnanswered = !b.answer ? 1 : 0;
      
      // Unanswered first
      if (aUnanswered !== bUnanswered) {
        return bUnanswered - aUnanswered;
      }
      
      // Then by timestamp (newer first)
      return b.timestamp - a.timestamp;
    });
    
    console.log(`✅ Final result: ${filtered.length} questions`);
    console.log('=====================================\n');
    
    setDisplayedQuestions(filtered);
  }, [filters, allQuestions, fuzzySearchQuestions]);
  
  // Apply filters when filters or questions change
  useEffect(() => {
    applyAllFilters();
  }, [applyAllFilters]);

  function handleSearch(query: string) {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search for better performance
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: query }));
    }, 300); // 300ms debounce
  }
  
  function handleCategoryChange(category: QuestionCategory | 'all') {
    console.log(`🏷️ Category changed: ${filters.category} → ${category}`);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilters(prev => ({ ...prev, category }));
  }

  function handleAskQuestion() {
    router.push('/ask-question');
  }

  function handleQuestionPress(questionId: string) {
    router.push(`/question/${questionId}`);
  }

  const handleShowUnanswered = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Toggle unanswered filter WITHOUT resetting category
    setFilters(prev => ({
      ...prev,
      showOnlyUnanswered: !prev.showOnlyUnanswered,
      searchQuery: '' // Clear search when toggling
    }));
    
    // Scroll to top
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleShowPendingAnswers = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/pending-answers');
  };

  const categories = Object.entries(CATEGORY_LABELS);

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
          <ThemedText style={[styles.headerTitle, { color: colors.text.onPrimary }]}>
            💬 שאלות ותשובות
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.text.onPrimary, opacity: 0.9 }]}>
            מאגר קהילתי של הלכה למעשה
          </ThemedText>
          {pendingAnswersCount > 0 && (
            <Pressable 
              style={({pressed}) => [
                styles.pendingAnswersBadge, 
                { backgroundColor: colors.accent.teal, marginTop: spacing.md },
                pressed && { opacity: 0.7 }
              ]}
              onPress={handleShowPendingAnswers}
              android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <Ionicons name="checkmark-done-circle" size={20} color="#FFFFFF" />
              <ThemedText style={styles.pendingAnswersBadgeText}>
                {pendingAnswersCount} תשובות ממתינות לאישור - לחץ לבדיקה
              </ThemedText>
            </Pressable>
          )}
          {unansweredCount > 0 && (
            <Pressable 
              style={({pressed}) => [
                styles.badge, 
                { backgroundColor: colors.accent.bronze },
                pressed && { opacity: 0.7 }
              ]}
              onPress={handleShowUnanswered}
              android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <ThemedText style={styles.badgeText}>
                {unansweredCount} שאלות ממתינות לתשובה
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface.card }]}>
            <Ionicons name="search" size={20} color={colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text.primary }]}
              placeholder="חפש שאלה..."
              placeholderTextColor={colors.text.secondary}
              value={filters.searchQuery}
              onChangeText={handleSearch}
            />
            {filters.searchQuery.length > 0 && (
              <Pressable onPress={() => handleSearch('')} hitSlop={10}>
                <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Ask Question Button */}
        <View style={styles.section}>
          <Pressable
            style={[styles.askButton, { backgroundColor: colors.accent.bronze }]}
            onPress={handleAskQuestion}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <ThemedText style={styles.askButtonText}>
              ❓ שאל שאלה חדשה
            </ThemedText>
          </Pressable>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text.primary }]}>
            📚 קטגוריות
          </ThemedText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <Pressable
              style={[
                styles.categoryChip,
                { backgroundColor: colors.surface.card },
                filters.category === 'all' && { backgroundColor: colors.primary.main }
              ]}
              onPress={() => handleCategoryChange('all')}
            >
              <ThemedText style={[
                styles.categoryText,
                { color: filters.category === 'all' ? colors.text.onPrimary : colors.text.primary }
              ]}>
                הכל ({allQuestions.length})
              </ThemedText>
            </Pressable>
            {categories.map(([key, label]) => {
              const count = allQuestions.filter(q => q.category === key).length;
              const isSelected = filters.category === key;
              return (
                <Pressable
                  key={key}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: colors.surface.card },
                    isSelected && { backgroundColor: colors.primary.main }
                  ]}
                  onPress={() => handleCategoryChange(key as QuestionCategory)}
                >
                  <ThemedText style={[
                    styles.categoryText,
                    { color: isSelected ? colors.text.onPrimary : colors.text.primary }
                  ]}>
                    {label} ({count})
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Popular Questions */}
        {!filters.searchQuery && !filters.showOnlyUnanswered && popularQuestions.length > 0 && (() => {
          // Filter popular questions by selected category
          const filteredPopular = filters.category === 'all' 
            ? popularQuestions 
            : popularQuestions.filter(q => q.category === filters.category);
          
          return filteredPopular.length > 0 ? (
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text.primary }]}>
                🔥 שאלות פופולריות
                {filters.category !== 'all' && ` ב${CATEGORY_LABELS[filters.category]}`}
              </ThemedText>
              {filteredPopular.map(question => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onPress={handleQuestionPress}
                  colors={colors}
                />
              ))}
            </View>
          ) : null;
        })()}

        {/* Questions List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {filters.showOnlyUnanswered 
                ? '⏰ שאלות ממתינות לתשובה' 
                : filters.searchQuery 
                ? '🔍 תוצאות חיפוש'
                : filters.category !== 'all'
                ? `📚 קטגוריה: ${CATEGORY_LABELS[filters.category]}`
                : '📋 כל השאלות'}
            </ThemedText>
            <ThemedText style={[styles.resultCount, { color: colors.text.secondary }]}>
              {displayedQuestions.length} שאלות
            </ThemedText>
          </View>
          {displayedQuestions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color={colors.text.secondary} />
              <ThemedText style={[styles.emptyText, { color: colors.text.secondary }]}>
                {filters.searchQuery 
                  ? 'לא נמצאו תוצאות רלוונטיות לחיפוש שלך' 
                  : 'עדיין אין שאלות בקטגוריה זו'}
              </ThemedText>
              {filters.searchQuery ? (
                <ThemedText style={[styles.emptyHint, { color: colors.text.secondary, opacity: 0.7 }]}>
                  נסה לחפש במילים אחרות או בקטגוריה אחרת
                </ThemedText>
              ) : (
                <ThemedText style={[styles.emptyHint, { color: colors.text.secondary, opacity: 0.7 }]}>
                  היה הראשון לשאול!
                </ThemedText>
              )}
            </View>
          ) : (
            displayedQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                onPress={handleQuestionPress}
                colors={colors}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// Question Card Component
function QuestionCard({ 
  question, 
  onPress, 
  colors 
}: { 
  question: Question; 
  onPress: (id: string) => void;
  colors: any;
}) {
  const trustScore = calculateTrustScore(question);
  const hasAnswer = !!question.answer;
  const isNew = !hasAnswer && question.status === 'pending';

  return (
    <Pressable
      style={[
        styles.questionCard, 
        { backgroundColor: colors.surface.card },
        isNew && { borderLeftWidth: 4, borderLeftColor: colors.accent.bronze }
      ]}
      onPress={() => onPress(question.id)}
    >
      <View style={styles.questionHeader}>
        <View style={styles.questionHeaderLeft}>
          <ThemedText style={[styles.categoryBadge, { backgroundColor: colors.primary.light }]}>
            {CATEGORY_LABELS[question.category]}
          </ThemedText>
          {isNew && (
            <View style={[styles.newBadge, { backgroundColor: colors.accent.bronze }]}>
              <ThemedText style={styles.newBadgeText}>חדש!</ThemedText>
            </View>
          )}
          {hasAnswer && (
            <View style={styles.trustBadge}>
              <Ionicons 
                name={trustScore > 80 ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={16} 
                color={trustScore > 80 ? Colors.light.semantic.success : colors.text.secondary} 
              />
              <ThemedText style={[styles.trustText, { color: colors.text.secondary }]}>
                {trustScore}% אמין
              </ThemedText>
            </View>
          )}
        </View>
        <View style={styles.statsRow}>
          <Ionicons name="eye-outline" size={14} color={colors.text.secondary} />
          <ThemedText style={[styles.statText, { color: colors.text.secondary }]}>
            {question.stats.views}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={[styles.questionText, { color: colors.text.primary }]}>
        {question.question}
      </ThemedText>

      {hasAnswer && question.answer && (
        <View style={styles.answerPreview}>
          <Ionicons name="chatbubble" size={14} color={colors.accent.bronze} />
          <ThemedText 
            style={[styles.answerPreviewText, { color: colors.text.secondary }]}
            numberOfLines={2}
          >
            {question.answer.text.substring(0, 100)}...
          </ThemedText>
        </View>
      )}

      <View style={styles.questionFooter}>
        <ThemedText style={[styles.timestamp, { color: colors.text.secondary }]}>
          {new Date(question.timestamp).toLocaleDateString('he-IL')}
        </ThemedText>
        {hasAnswer && (
          <View style={styles.helpfulBadge}>
            <Ionicons name="thumbs-up" size={12} color={colors.text.secondary} />
            <ThemedText style={[styles.helpfulText, { color: colors.text.secondary }]}>
              {question.stats.helpful}
            </ThemedText>
          </View>
        )}
      </View>
    </Pressable>
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
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  pendingAnswersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  pendingAnswersBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    marginTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  questionCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  questionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  answerPreview: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  answerPreviewText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  timestamp: {
    fontSize: 11,
  },
  helpfulBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpfulText: {
    fontSize: 11,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
