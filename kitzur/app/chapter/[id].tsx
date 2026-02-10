/**
 * Chapter Detail Screen
 * Displays the list of sections within a selected chapter
 */
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { getChapter, type Chapter } from '@/utils/contentLoader';
import SectionList from '@/components/SectionList';
import { markSimanCompleted, isSimanCompleted, unmarkSimanCompleted } from '@/utils/progress';
import { Colors, spacing } from '@/constants/theme';

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const loadChapter = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const data = await getChapter(id);
    setChapter(data);
    
    // Check if chapter is already completed
    const isCompleted = await isSimanCompleted(id);
    setCompleted(isCompleted);
    
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadChapter();
  }, [loadChapter]);

  async function handleMarkComplete() {
    if (!id || !chapter) return;
    
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (completed) {
      // Unmark as completed
      await unmarkSimanCompleted(id);
      setCompleted(false);
      Alert.alert('הוסר', `${chapter.chapterLabel} הוסר מרשימת המושלמים`);
    } else {
      // Mark as completed
      await markSimanCompleted(id);
      setCompleted(true);
      Alert.alert('✅ הושלם', `${chapter.chapterLabel} סומן כהושלם`);
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!chapter) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>לא נמצא סימן</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.contentHeader}>
        <ThemedText style={styles.chapterLabel}>
          {chapter.chapterLabel}
        </ThemedText>
        <ThemedText style={styles.title}>
          {chapter.title}
        </ThemedText>
        
        {/* Mark as Complete Button */}
        <Pressable 
          style={[styles.completeButton, completed && styles.completeButtonDone]}
          onPress={handleMarkComplete}
        >
          <Ionicons 
            name={completed ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={20} 
            color={completed ? Colors.light.semantic.success : Colors.light.primary.main}
          />
          <ThemedText style={[styles.completeButtonText, completed && styles.completeButtonTextDone]}>
            {completed ? 'הושלם ✓ (לחץ לביטול)' : 'סמן כהושלם'}
          </ThemedText>
        </Pressable>
      </ThemedView>
      <SectionList chapter={chapter} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.base,
  },
  contentHeader: {
    padding: spacing.lg,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: Colors.light.surface.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border.default,
  },
  chapterLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    color: Colors.light.text.secondary,
    opacity: 0.9,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 0,
    color: Colors.light.text.onPrimary,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.light.primary.light + '20',
    gap: 8,
    marginTop: 12,
  },
  completeButtonDone: {
    backgroundColor: Colors.light.semantic.success + '20',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary.main,
  },
  completeButtonTextDone: {
    color: Colors.light.semantic.success,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 12,
  },
  sectionCountBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.light.accent.main,
  },
  sectionCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text.onPrimary,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    color: Colors.light.text.secondary,
  },
});
