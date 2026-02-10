import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, spacing } from '@/constants/theme';
import { searchContent, type Chapter, type Section } from '@/utils/contentLoader';
import { toHebrewNumeral } from '@/utils/hebrewNumbers';

type SearchResult = {
  chapter: Chapter;
  section: Section;
  matchScore: number;
};

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const matches = await searchContent(trimmed);
        setResults(matches.slice(0, 100));
      } finally {
        setLoading(false);
      }
    }, 250);
  }, [query]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <LinearGradient
        colors={['#4A90E2', '#B394E8', '#00D2D3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientHeader, { paddingTop: 60 }]}
      >
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>חיפוש</ThemedText>
          <ThemedText style={styles.headerSubtitle}>חפש בכל הסימנים</ThemedText>
        </View>
      </LinearGradient>
      
      <View style={styles.searchBox}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface.card, color: colors.text.primary }]}
          placeholder="חפש בתכנים..."
          placeholderTextColor={colors.text.secondary}
          value={query}
          onChangeText={setQuery}
          textAlign="right"
          autoCorrect={false}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary.main} />
          <ThemedText style={[styles.loadingText, { color: colors.text.secondary }]}>מחפש...</ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          {results.length === 0 && query.trim().length >= 2 ? (
            <ThemedText style={[styles.emptyText, { color: colors.text.secondary }]}>לא נמצאו תוצאות</ThemedText>
          ) : null}

          {results.map((result) => (
            <Pressable
              key={result.section.id}
              style={[styles.resultCard, { backgroundColor: colors.surface.card }]}
              onPress={() => router.push(`/section/${result.section.id}`)}
            >
              <ThemedText style={[styles.resultTitle, { color: colors.text.primary }]}> 
                {result.chapter.chapterLabel} - {result.chapter.title}
              </ThemedText>
              <ThemedText style={[styles.resultSubtitle, { color: colors.text.secondary }]}> 
                סעיף {toHebrewNumeral(result.section.section)}
              </ThemedText>
              <ThemedText
                style={[styles.resultPreview, { color: colors.text.secondary }]}
                numberOfLines={2}
              >
                {result.section.text}
              </ThemedText>
            </Pressable>
          ))}
          <View style={styles.footerSpace} />
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
  },
  searchBox: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  resultCard: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  resultSubtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
  },
  resultPreview: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  footerSpace: {
    height: 24,
  },
});
