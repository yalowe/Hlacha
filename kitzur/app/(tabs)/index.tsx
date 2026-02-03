/**
 * Home Screen - Dashboard with progress tracking and quick actions
 */
import { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, View, Text } from 'react-native';
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
import { listChapters, getChapterCount, type Chapter } from '@/utils/contentLoader';
import { 
  getLastRead, 
  getCompletedCount, 
  getStreak, 
  getDailyQuote,
  getRandomHalachaId,
  type LastRead,
  type Streak,
} from '@/utils/progress';
import { Colors, spacing } from '@/constants/theme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState<Streak>({ count: 0, lastDate: '' });
  const [quote] = useState(getDailyQuote());

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
      // Get total chapter count without loading all content
      const count = getChapterCount();
      setTotalCount(count);

      // Load progress data
      const lastReadData = await getLastRead();
      console.log('📖 Last Read Data:', lastReadData);
      setLastRead(lastReadData);

      const completed = await getCompletedCount();
      console.log('✅ Completed Count:', completed);
      setCompletedCount(completed);

      const streakData = await getStreak();
      console.log('🔥 Streak Data:', streakData);
      setStreak(streakData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBrowse = () => {
    router.push('/browse');
  };

  const handleSearch = () => {
    router.push('/explore');
  };

  const handleBookmarks = () => {
    router.push('/bookmarks');
  };

  const handleRandom = async () => {
    const count = getChapterCount();
    if (count > 0) {
      const randomId = getRandomHalachaId(count);
      router.push(`/chapter/${randomId}`);
    }
  };

  const handleShnayimMikra = () => {
    router.push('/shnayim-mikra');
  };

  const handleParshatHaMann = () => {
    router.push('/parshat-hamann');
  };

  if (loading) {
    return (
      <ThemedView style={[styles.loadingContainer, { backgroundColor: colors.background.base }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <ThemedText style={[styles.loadingText, { color: colors.text.primary }]}>טוען...</ThemedText>
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
            Welcome back
          </Text>
          <Text style={[styles.title, { color: colors.text.onPrimary }]}>
            קיצור שולחן ערוך
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
              Progress
            </Text>
            <View style={styles.progressRingContainer}>
              <ProgressRing completed={completedCount} total={totalCount} size={100} />
            </View>
            <Text style={[styles.statDetail, { color: colors.text.secondary }]}>
              {completedCount} of {totalCount} simanim
            </Text>
          </View>
          
          <View style={styles.streakContainer}>
            <StreakCounter count={streak.count} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Quick Actions
          </Text>
          <QuickActionsGrid
            onBrowse={handleBrowse}
            onSearch={handleSearch}
            onBookmarks={handleBookmarks}
            onRandom={handleRandom}
            onShnayimMikra={handleShnayimMikra}
            onParshatHaMann={handleParshatHaMann}
          />
        </View>

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
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
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
});
