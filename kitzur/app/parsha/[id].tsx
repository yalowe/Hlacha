import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { loadParsha, type Parsha, PARSHIOT_LIST } from '@/utils/parshaLoader';
import { formatHebrewChapter, toHebrewNumeral } from '@/utils/hebrewNumbers';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ParshaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [parsha, setParsha] = useState<Parsha | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadParshaData();
    }
  }, [id]);

  async function loadParshaData() {
    setLoading(true);
    const data = await loadParsha(id!);
    setParsha(data);
    setLoading(false);
  }

  const parshaInfo = PARSHIOT_LIST.find(p => p.id === id);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>טוען פרשה...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!parsha || !parshaInfo) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>לא נמצאה פרשה</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Modern gradient header */}
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={['#2E5C8A', '#4A90E2', '#6FB1FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="book" size={32} color="#fff" />
              </View>
              
              <ThemedText style={styles.parshaLabel}>פרשת השבוע</ThemedText>
              
              {/* Main parsha name - BOLD and PROMINENT */}
              <ThemedText style={styles.parshaName}>
                {parshaInfo.name}
              </ThemedText>
              
              {/* Subtle subtitle */}
              <ThemedText style={styles.subtitle}>
                {parshaInfo.book}
              </ThemedText>
              
              {/* Decorative divider */}
              <View style={styles.divider} />
              
              <ThemedText style={styles.description}>
                שניים מקרא ואחד תרגום
              </ThemedText>
            </View>
          </LinearGradient>
        </View>

        {parsha.chapters.map((chapter) => (
          <ThemedView key={chapter.chapter} style={styles.chapterContainer}>
            <ThemedView style={styles.chapterHeader}>
              <ThemedText type="subtitle" style={styles.chapterTitle}>
                {formatHebrewChapter(chapter.chapter)}
              </ThemedText>
            </ThemedView>

            {chapter.verses.map((verse) => (
              <ThemedView key={verse.verseNum} style={styles.verseContainer}>
                <ThemedView style={styles.verseNumber}>
                  <ThemedText style={styles.verseNumberText}>
                    {toHebrewNumeral(verse.verseNum)}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.verseContent}>
                  {/* Hebrew text - first reading */}
                  <ThemedView style={styles.textBlock}>
                    <ThemedText style={styles.label}>עברי (א')</ThemedText>
                    <ThemedText style={styles.hebrewText}>
                      {verse.hebrew}
                    </ThemedText>
                  </ThemedView>

                  {/* Hebrew text - second reading */}
                  <ThemedView style={styles.textBlock}>
                    <ThemedText style={styles.label}>עברי (ב')</ThemedText>
                    <ThemedText style={styles.hebrewText}>
                      {verse.hebrew}
                    </ThemedText>
                  </ThemedView>

                  {/* Targum text */}
                  <ThemedView style={styles.textBlock}>
                    <ThemedText style={styles.label}>תרגום</ThemedText>
                    <ThemedText style={styles.targumText}>
                      {verse.targum}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientHeader: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  parshaLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1,
  },
  parshaName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.5,
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: '#fff',
    opacity: 0.6,
    marginVertical: 12,
    borderRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.85,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '400',
  },
  description: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    fontWeight: '300',
  },
  chapterContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  chapterHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  verseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  verseNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verseContent: {
    flex: 1,
  },
  textBlock: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 4,
  },
  hebrewText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: 'System',
  },
  targumText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'right',
    fontFamily: 'System',
    opacity: 0.8,
  },
});
