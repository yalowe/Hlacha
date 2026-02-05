/**
 * Bookmarks Screen - Saved bookmarks
 */
import React from 'react';
import { StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { Colors, spacing } from '@/constants/theme';
import { toHebrewNumeral } from '@/utils/hebrewNumbers';

export default function BookmarksScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { bookmarks } = useApp();

  function navigateToSection(sectionId: string) {
    router.push(`/section/${sectionId}`);
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScrollView style={styles.scrollView}>
        {bookmarks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bookmark-outline" size={64} color={colors.text.secondary} />
            <ThemedText style={[styles.emptyText, { color: colors.text.primary }]}>אין סימניות שמורות</ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.text.secondary }]}>
              לחץ על כוכב בעת קריאה כדי לשמור סימניות
            </ThemedText>
          </View>
        ) : (
          <View style={styles.bookmarksContainer}>
            {bookmarks.map((bookmark) => (
              <Pressable
                key={bookmark.id}
                style={[styles.bookmarkItem, { backgroundColor: colors.surface.card }]}
                onPress={() => navigateToSection(bookmark.sectionId)}
              >
                <View style={styles.bookmarkContent}>
                  <ThemedText style={[styles.bookmarkChapter, { color: colors.text.primary }]}>
                    {bookmark.chapterLabel} - {bookmark.chapterTitle}
                  </ThemedText>
                  <ThemedText style={[styles.bookmarkSection, { color: colors.text.secondary }]}>
                    סעיף {toHebrewNumeral(bookmark.sectionNumber)}
                  </ThemedText>
                </View>
                <Ionicons name="bookmark" size={24} color={colors.accent.bronze} />
              </Pressable>
            ))}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  bookmarksContainer: {
    padding: spacing.md,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  bookmarkContent: {
    flex: 1,
    marginRight: 12,
  },
  bookmarkChapter: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookmarkSection: {
    fontSize: 14,
  },
});
