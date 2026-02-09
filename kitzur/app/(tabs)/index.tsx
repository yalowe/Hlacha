/**
 * Home Screen - Dashboard with progress tracking and quick actions
 */
import { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ContinueLearningCard } from '@/components/ContinueLearningCard';
import { ProgressRing } from '@/components/ProgressRing';
import { QuickActionsGrid } from '@/components/QuickActionsGrid';
import { StreakCounter } from '@/components/StreakCounter';
import { DailyQuoteCard } from '@/components/DailyQuoteCard';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { 
  getLastRead, 
  getCompletedCount, 
  getStreak, 
  getDailyQuote,
  getDailyHalachaId,
  type LastRead,
  type Streak,
} from '@/utils/progress';
import { getUnansweredQuestions } from '@/utils/questionsManager';
import type { Question } from '@/types/questions';
import { Colors, spacing } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hardcoded count to avoid loading entire chapters-index on startup
const TOTAL_CHAPTER_COUNT = 2008;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const totalCount = TOTAL_CHAPTER_COUNT;
  const [streak, setStreak] = useState<Streak>({ count: 0, lastDate: '' });
  const [quote] = useState(getDailyQuote());
  const [unansweredQuestions, setUnansweredQuestions] = useState<Question[]>([]);
  const [pendingAnswersCount, setPendingAnswersCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Refresh dashboard when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  async function loadDashboardData() {
    setLoading(true);
    try {
      // Total count is hardcoded - no need to load chapters-index
      
      // Load progress data
      const lastReadData = await getLastRead();
      setLastRead(lastReadData);

      const completed = await getCompletedCount();
      setCompletedCount(completed);

      const streakData = await getStreak();
      setStreak(streakData);

      // Load unanswered questions
      const unanswered = await getUnansweredQuestions();
      setUnansweredQuestions(unanswered.slice(0, 3)); // Show max 3 questions

      // Load pending answers count
      await loadPendingAnswersCount();
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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

  const handleBrowse = () => {
    router.push('/browse');
  };

  const handleSearch = () => {
    router.push('/search');
  };

  const handleBookmarks = () => {
    router.push('/bookmarks');
  };

  const handleDailyHalacha = async () => {
    try {
      const dailySectionId = getDailyHalachaId(); // Returns section ID like "kitzur_orach_chaim-175-s9"
      
      // Try to find the section
      const { findSectionById, getChapter } = await import('@/utils/contentLoader');
      let result = await findSectionById(dailySectionId);
      
      if (!result) {
        // Section not found - get the chapter and find a valid section
        const chapterId = dailySectionId.split('-s')[0]; // Extract chapter ID
        const requestedSectionNum = parseInt(dailySectionId.split('-s')[1]); // e.g., 9
        
        const chapter = await getChapter(chapterId);
        if (chapter && chapter.sections.length > 0) {
          // Use modulo to wrap around to valid section numbers
          const validSectionNum = ((requestedSectionNum - 1) % chapter.sections.length) + 1;
          const validSectionId = `${chapterId}-s${validSectionNum}`;
          
          router.push(`/section/${validSectionId}`);
        } else {
          Alert.alert('❌ שגיאה', 'לא נמצאה הלכה יומית להצגה');
        }
      } else {
        // Navigate directly to the section
        router.push(`/section/${dailySectionId}`);
      }
    } catch (error) {
      console.error('Error loading daily halacha:', error);
      Alert.alert('❌ שגיאה', 'לא נמצאה הלכה יומית להצגה');
    }
  };

  const [currentParsha, setCurrentParsha] = useState<string>('פרשת השבוע');

  useEffect(() => {
    const loadCurrentParsha = async () => {
      try {
        const { getCurrentParsha } = await import('@/utils/parshaLoader');
        const parsha = await getCurrentParsha(); // Now async
        if (parsha) {
          setCurrentParsha(parsha.name);
        }
      } catch (error) {
        console.error('Error loading current parsha:', error);
      }
    };
    loadCurrentParsha();
  }, []);


  const handleShnayimMikra = () => {
    router.push('/shnayim-mikra');
  };

  const handleParshatHaMann = () => {
    router.push('/parshat-hamann');
  };

  const handleIggeretHaRamban = () => {
    router.push('/iggeret-haramban');
  };

  const handleBirkatHaMazon = () => {
    router.push('/birkat-hamazon');
  };

  const handleBoreiNefashot = () => {
    router.push('/borei-nefashot');
  };

  const handleMeeinShalosh = () => {
    router.push('/meein-shalosh');
  };

  const handleQuestions = () => {
    router.push('/questions');
  };

  const handleAddSection = () => {
    router.push('/add-section');
  };

  if (loading) {
    return (
      <ThemedView style={[styles.loadingContainer, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.loadingIconContainer}>
          <Text style={styles.loadingIcon}>📖</Text>
        </View>
        <View style={styles.appNameContainer}>
          <Text style={styles.appNameLoadingMain}>למען שמו</Text>
          <Text style={styles.appNameLoadingSub}>באהבה</Text>
        </View>
        <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
        <ThemedText style={[styles.loadingText, { color: '#666666' }]}>טוען...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
          <Text style={[styles.greeting, { color: colors.text.onPrimary, opacity: 0.9 }]}>
            {currentParsha}
          </Text>
          <Text style={[styles.title, { color: colors.text.onPrimary }]}>
            לְמַעַן שְׁמוֹ בְּאַהֲבָה
          </Text>
        </View>

        {/* Continue Learning */}
        {lastRead && (
          <View style={styles.section}>
            <ContinueLearningCard lastRead={lastRead} />
          </View>
        )}

        {/* Progress & Streak Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface.card }]}>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              התקדמות
            </Text>
            <View style={styles.progressRingContainer}>
              <ProgressRing completed={completedCount} total={totalCount} size={100} />
            </View>
            <Text style={[styles.statDetail, { color: colors.text.secondary }]}>
              מתוך {totalCount.toLocaleString('he-IL')} סימנים
            </Text>
          </View>
          
          <View style={styles.streakContainer}>
            <StreakCounter count={streak.count} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            פעולות מהירות
          </Text>
          <QuickActionsGrid
            onBrowse={handleBrowse}
            onSearch={handleSearch}
            onBookmarks={handleBookmarks}
            onDailyHalacha={handleDailyHalacha}
            onQuestions={handleQuestions}
            onAddSection={handleAddSection}
            onShnayimMikra={handleShnayimMikra}
            onParshatHaMann={handleParshatHaMann}
            onIggeretHaRamban={handleIggeretHaRamban}
            onBirkatHaMazon={handleBirkatHaMazon}
            onBoreiNefashot={handleBoreiNefashot}
            onMeeinShalosh={handleMeeinShalosh}
            questionsCount={unansweredQuestions.length}
            pendingAnswersCount={pendingAnswersCount}
          />
        </View>

        {/* Unanswered Questions */}
        {unansweredQuestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                💬 שאלות שממתינות לתשובה
              </Text>
              <Pressable 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/questions');
                }}
                style={styles.viewAllButton}
              >
                <ThemedText style={[styles.viewAllText, { color: colors.primary.main }]}>
                  צפה בכל →
                </ThemedText>
              </Pressable>
            </View>
            {unansweredQuestions.map((question) => (
              <Pressable
                key={question.id}
                style={[styles.questionCard, { backgroundColor: colors.surface.card }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/question/${question.id}`);
                }}
              >
                <View style={styles.questionHeader}>
                  <View style={[styles.newBadge, { backgroundColor: colors.accent.bronze }]}>
                    <ThemedText style={styles.newBadgeText}>חדש</ThemedText>
                  </View>
                  <View style={styles.questionStats}>
                    <Ionicons name="eye-outline" size={14} color={colors.text.secondary} />
                    <ThemedText style={[styles.viewCount, { color: colors.text.secondary }]}>
                      {question.stats.views}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText 
                  style={[styles.questionText, { color: colors.text.primary }]}
                  numberOfLines={2}
                >
                  {question.question}
                </ThemedText>
                <View style={styles.questionFooter}>
                  <ThemedText style={[styles.questionTime, { color: colors.text.secondary }]}>
                    {new Date(question.timestamp).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                  </ThemedText>
                  <Pressable
                    style={[styles.answerNowButton, { backgroundColor: colors.primary.main }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      router.push(`/answer-question?id=${question.id}`);
                    }}
                  >
                    <Ionicons name="create" size={16} color="#FFFFFF" />
                    <ThemedText style={styles.answerNowText}>ענה עכשיו</ThemedText>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Daily Quote */}
        <View style={styles.section}>
          <DailyQuoteCard text={quote.text} source={quote.source} />
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
  contentContainer: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  loadingIcon: {
    fontSize: 70,
  },
  appNameContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  appNameLoadingMain: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: 3,
  },
  appNameLoadingSub: {
    fontSize: 44,
    fontWeight: '900',
    color: '#007AFF',
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: 4,
    marginTop: -8,
  },
  spinner: {
    marginTop: 20,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressRingContainer: {
    marginVertical: 8,
  },
  statDetail: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  streakContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  questionCard: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
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
    marginBottom: spacing.xs,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  questionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewCount: {
    fontSize: 12,
  },
  questionText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionTime: {
    fontSize: 11,
  },
  answerNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  answerNowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
