/**
 * Section Detail Screen
 * Displays the full text of a selected section with sharing and bookmark features
 */
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Pressable, Share, Alert, View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { findSectionById, type Chapter, type Section } from '@/utils/contentLoader';
import { useApp } from '@/contexts/AppContext';
import { saveLastRead, updateStreak } from '@/utils/progress';
import { Colors, spacing } from '@/constants/theme';
import { toHebrewNumeral } from '@/utils/hebrewNumbers';

export default function SectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const { addBookmark, removeBookmark, isBookmarked, getTextSizeMultiplier } = useApp();

  useEffect(() => {
    loadSection();
  }, [id]);

  async function loadSection() {
    if (!id) return;
    setLoading(true);
    const result = await findSectionById(id);
    if (result) {
      setChapter(result.chapter);
      setSection(result.section);
      
      // Save last read position with full data
      const lastReadData = {
        chapterId: result.chapter.id,
        sectionId: result.section.id,
        chapterLabel: result.chapter.chapterLabel,
        chapterTitle: result.chapter.title,
        sectionNumber: result.section.section,
        timestamp: Date.now(),
      };
      await saveLastRead(lastReadData);
      
      // Update daily streak
      const newStreak = await updateStreak();
    }
    setLoading(false);
  }

  async function handleBookmark() {
    if (!section || !chapter) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const bookmarkId = section.id;
    
    if (isBookmarked(bookmarkId)) {
      await removeBookmark(bookmarkId);
      Alert.alert('✅ הוסר', 'הסימניה הוסרה');
    } else {
      await addBookmark({
        id: bookmarkId,
        chapterId: chapter.id,
        sectionId: section.id,
        sectionNumber: section.section,
        chapterLabel: chapter.chapterLabel,
        chapterTitle: chapter.title,
        timestamp: Date.now(),
      });
      Alert.alert('✅ נוסף', 'הסימניה נוספה בהצלחה');
    }
  }

  async function handleShare() {
    if (!section || !chapter) return;
    const text = `${chapter.chapterLabel} - ${chapter.title}\nסעיף ${toHebrewNumeral(section.section)}\n\n${section.text}`;
    
    try {
      await Share.share({
        message: text,
        title: `${chapter.chapterLabel} - ${chapter.title}`,
      });
    } catch (error) {
      console.error('כשל בשיתוף:', error);
    }
  }

  async function handleCopy() {
    if (!section || !chapter) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const text = `${chapter.chapterLabel} - ${chapter.title}\nסעיף ${toHebrewNumeral(section.section)}\n\n${section.text}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('✅ הועתק', 'הטקסט הועתק ללוח');
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!section || !chapter) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>לא נמצא סעיף</ThemedText>
      </ThemedView>
    );
  }

  const textMultiplier = getTextSizeMultiplier();
  const bookmarked = isBookmarked(section.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.contentHeader}>
        <ThemedText style={styles.breadcrumb}>
          {chapter.chapterLabel}
        </ThemedText>
        <ThemedText style={styles.chapterTitle}>
          {chapter.title}
        </ThemedText>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>
        <ThemedText style={styles.sectionTitle}>
          סעיף {toHebrewNumeral(section.section)}
        </ThemedText>
      </ThemedView>

      <View style={styles.contentCard}>
        <Text 
          style={[styles.text, { fontSize: 17 * textMultiplier }]}
        >
          {section.text}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable 
          style={styles.actionButton} 
          onPress={handleBookmark}
        >
          <Ionicons 
            name={bookmarked ? 'bookmark' : 'bookmark-outline'} 
            size={24} 
            color={Colors.light.primary.main} 
          />
          <Text style={styles.actionText}>
            {bookmarked ? 'שמור' : 'שמור'}
          </Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={Colors.light.primary.main} />
          <Text style={styles.actionText}>שתף</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleCopy}>
          <Ionicons name="copy-outline" size={24} color={Colors.light.primary.main} />
          <Text style={styles.actionText}>העתק</Text>
        </Pressable>
      </View>
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.base,
  },
  contentHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.light.surface.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border.default,
  },
  breadcrumb: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 6,
    color: Colors.light.text.secondary,
    fontWeight: '500',
  },
  chapterTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    color: Colors.light.text.primary,
    fontWeight: '600',
  },
  dividerContainer: {
    marginVertical: 8,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.light.accent.bronze,
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.text.primary,
  },
  contentCard: {
    backgroundColor: Colors.light.background.surface,
    padding: spacing.lg,
  },
  text: {
    lineHeight: 32,
    textAlign: 'right',
    color: Colors.light.text.primary,
    fontSize: 17,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: Colors.light.background.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border.default,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    minWidth: 80,
  },
  actionText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary.main,
  },
  footer: {
    height: 40,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    color: Colors.light.text.secondary,
  },
});
