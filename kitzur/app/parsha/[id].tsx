import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { loadParsha, type Parsha, PARSHIOT_LIST } from '@/utils/parshaLoader';

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
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            פרשת {parshaInfo.name}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {parshaInfo.book} • {parshaInfo.nameEn}
          </ThemedText>
          <ThemedText style={styles.description}>
            שניים מקרא ואחד תרגום
          </ThemedText>
        </ThemedView>

        {parsha.chapters.map((chapter) => (
          <ThemedView key={chapter.chapter} style={styles.chapterContainer}>
            <ThemedView style={styles.chapterHeader}>
              <ThemedText type="subtitle" style={styles.chapterTitle}>
                פרק {chapter.chapter}
              </ThemedText>
            </ThemedView>

            {chapter.verses.map((verse) => (
              <ThemedView key={verse.verseNum} style={styles.verseContainer}>
                <ThemedView style={styles.verseNumber}>
                  <ThemedText style={styles.verseNumberText}>
                    {verse.verseNum}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
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
