/**
 * Browse Screen - Category selection and chapter list
 */
import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, View, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ChapterList from '@/components/ChapterList';
import { listChapters, type Chapter } from '@/utils/contentLoader';
import { Colors, spacing } from '@/constants/theme';

type Category = 'all' | 'kitzur' | 'orach_chaim' | 'yoreh_deah' | 'even_haezer' | 'choshen_mishpat';

const CATEGORIES = [
  { id: 'kitzur' as Category, name: 'קיצור שולחן ערוך', nameEn: 'Kitzur Shulchan Aruch', count: 303 },
  { id: 'orach_chaim' as Category, name: 'מרן - אורח חיים', nameEn: 'Maran - Orach Chaim', count: 697 },
  { id: 'yoreh_deah' as Category, name: 'מרן - יורה דעה', nameEn: 'Maran - Yoreh De\'ah', count: 402 },
  { id: 'even_haezer' as Category, name: 'מרן - אבן העזר', nameEn: 'Maran - Even HaEzer', count: 178 },
  { id: 'choshen_mishpat' as Category, name: 'מרן - חושן משפט', nameEn: 'Maran - Choshen Mishpat', count: 427 },
];

export default function BrowseScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadChapters(category: Category) {
    setLoading(true);
    const allChapters = await listChapters();
    
    // Filter chapters by category
    let filtered: Chapter[];
    if (category === 'kitzur') {
      filtered = allChapters.filter(ch => ch.id.startsWith('kitzur_orach_chaim-'));
    } else {
      filtered = allChapters.filter(ch => ch.id.startsWith(category + '-'));
    }
    
    setChapters(filtered);
    setLoading(false);
  }

  function handleCategorySelect(category: Category) {
    setSelectedCategory(category);
    loadChapters(category);
  }

  function handleBack() {
    setSelectedCategory(null);
    setChapters([]);
  }

  // Show category selection
  if (!selectedCategory) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
        {/* Modern gradient header */}
        <LinearGradient
          colors={['#74B9FF', '#4A90E2', '#B394E8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientHeader, { paddingTop: 60 }]}
        >
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>
              עיון בספרים - לפי מרן
            </ThemedText>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              style={({ pressed }) => [
                styles.categoryCard,
                { 
                  backgroundColor: colors.surface.card,
                  opacity: pressed ? 0.7 : 1,
                }
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <View style={styles.categoryContent}>
                <ThemedText style={[styles.categoryNameHe, { color: colors.text.primary }]}>
                  {category.name}
                </ThemedText>
                <ThemedText style={[styles.categoryNameEn, { color: colors.text.secondary }]}>
                  {category.nameEn}
                </ThemedText>
                <ThemedText style={[styles.categoryCount, { color: colors.text.secondary }]}>
                  {category.count} סימנים
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ThemedView>
    );
  }

  // Show loading
  if (loading) {
    return (
      <ThemedView style={[styles.loadingContainer, { backgroundColor: colors.background.base }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <ThemedText style={[styles.loadingText, { color: colors.text.primary }]}>טוען...</ThemedText>
      </ThemedView>
    );
  }

  // Show chapters for selected category
  const selectedCat = CATEGORIES.find(c => c.id === selectedCategory);
  
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <ThemedText style={[styles.backText, { color: colors.text.onPrimary }]}>
            ← חזור
          </ThemedText>
        </Pressable>
        <ThemedText style={[styles.headerTitle, { color: colors.text.onPrimary }]}>
          {selectedCat?.name}
        </ThemedText>
      </View>

      <ScrollView style={styles.scrollView}>
        <ChapterList chapters={chapters} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  gradientHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: spacing.sm,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    padding: spacing.md,
    gap: spacing.md,
  },
  categoryCard: {
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    gap: spacing.xs,
  },
  categoryNameHe: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  categoryNameEn: {
    fontSize: 16,
    textAlign: 'right',
  },
  categoryCount: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: spacing.xs,
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
});
