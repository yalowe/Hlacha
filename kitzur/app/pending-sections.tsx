/**
 * Pending Sections Screen
 * Review and approve user-submitted sections
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const BOOK_LABELS: Record<string, string> = {
  orach_chaim: 'אורח חיים',
  yoreh_deah: 'יורה דעה',
  even_haezer: 'אבן העזר',
  choshen_mishpat: 'חושן משפט',
  other: 'אחר'
};

interface PendingSection {
  id: string;
  book: string;
  bookLabel?: string;  // For custom book names
  siman: number;
  seif: number;
  title: string;
  content: string;
  tags: string[];
  source: string;
  dateAdded: number;
  status: string;
}

export default function PendingSectionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [sections, setSections] = useState<PendingSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingSections();
  }, []);

  async function loadPendingSections() {
    try {
      const PENDING_KEY = '@kitzur_pending_sections';
      const stored = await AsyncStorage.getItem(PENDING_KEY);
      const pending = stored ? JSON.parse(stored) : [];
      setSections(pending);
    } catch (error) {
      console.error('Failed to load pending sections:', error);
    } finally {
      setLoading(false);
    }
  }

  async function approveSection(sectionId: string) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert(
      '✅ אושר!',
      'הסעיף אושר ויתווסף לאפליקציה בעדכון הבא.\n\n(בגרסת ייצור, זה ישלח לשרת)',
      [{ text: 'סגור' }]
    );

    // Remove from pending
    const updated = sections.filter(s => s.id !== sectionId);
    setSections(updated);
    await AsyncStorage.setItem('@kitzur_pending_sections', JSON.stringify(updated));
  }

  async function rejectSection(sectionId: string) {
    Alert.alert(
      '❌ למחוק?',
      'האם אתה בטוח שאתה רוצה למחוק סעיף זה?',
      [
        { text: 'ביטול', style: 'cancel' },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            const updated = sections.filter(s => s.id !== sectionId);
            setSections(updated);
            await AsyncStorage.setItem('@kitzur_pending_sections', JSON.stringify(updated));
          }
        }
      ]
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary.main }]}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.onPrimary} />
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: colors.text.onPrimary }]}>
            🔍 סעיפים ממתינים
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.text.onPrimary, opacity: 0.9 }]}>
            {sections.length} סעיפים לבדיקה
          </ThemedText>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ThemedText style={[styles.emptyText, { color: colors.text.secondary }]}>
              טוען...
            </ThemedText>
          ) : sections.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={64} color={colors.text.secondary} />
              <ThemedText style={[styles.emptyText, { color: colors.text.secondary }]}>
                אין סעיפים ממתינים
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: colors.text.secondary }]}>
                כל הסעיפים אושרו! 🎉
              </ThemedText>
            </View>
          ) : (
            sections.map((section) => (
              <View
                key={section.id}
                style={[styles.card, { backgroundColor: colors.surface.card }]}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View>
                    <ThemedText style={[styles.bookLabel, { color: colors.primary.main }]}>
                      {section.bookLabel || BOOK_LABELS[section.book] || section.book}
                    </ThemedText>
                    <ThemedText style={[styles.cardTitle, { color: colors.text.primary }]}>
                      סימן {section.siman} • סעיף {section.seif}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.dateText, { color: colors.text.secondary }]}>
                    {new Date(section.dateAdded).toLocaleDateString('he-IL')}
                  </ThemedText>
                </View>

                {/* Title */}
                <ThemedText style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  {section.title}
                </ThemedText>

                {/* Content Preview */}
                <ThemedText
                  style={[styles.contentPreview, { color: colors.text.secondary }]}
                  numberOfLines={3}
                >
                  {section.content}
                </ThemedText>

                {/* Tags */}
                {section.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {section.tags.map((tag, idx) => (
                      <View
                        key={idx}
                        style={[styles.tag, { backgroundColor: colors.primary.light }]}
                      >
                        <ThemedText style={[styles.tagText, { color: colors.primary.main }]}>
                          {tag}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Source */}
                {section.source && (
                  <ThemedText style={[styles.sourceText, { color: colors.text.secondary }]}>
                    📚 מקור: {section.source}
                  </ThemedText>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.approveButton, { backgroundColor: Colors.light.semantic.success }]}
                    onPress={() => approveSection(section.id)}
                  >
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    <ThemedText style={styles.buttonText}>אשר</ThemedText>
                  </Pressable>

                  <Pressable
                    style={[styles.rejectButton, { backgroundColor: Colors.light.semantic.error }]}
                    onPress={() => rejectSection(section.id)}
                  >
                    <Ionicons name="close" size={20} color="#FFFFFF" />
                    <ThemedText style={styles.buttonText}>דחה</ThemedText>
                  </Pressable>
                </View>
              </View>
            ))
          )}
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
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bookLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'right',
  },
  contentPreview: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: spacing.sm,
    textAlign: 'right',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sourceText: {
    fontSize: 12,
    marginBottom: spacing.md,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: 6,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: spacing.sm,
  },
});
