import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import type { LastRead } from '@/utils/progress';

interface ContinueLearningCardProps {
  lastRead: LastRead | null;
}

export function ContinueLearningCard({ lastRead }: ContinueLearningCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!lastRead) {
    return null;
  }

  return (
    <Link href={`/section/${lastRead.sectionId}`} asChild>
      <Pressable 
        style={[styles.card, { backgroundColor: colors.primary.main }]}
        android_ripple={{ color: colors.primary.dark }}
      >
        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.text.onPrimary }]}>
            המשך לימוד
          </Text>
          <Text style={[styles.title, { color: colors.text.onPrimary }]} numberOfLines={1}>
            {lastRead.chapterLabel} • {lastRead.chapterTitle}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.onPrimary, opacity: 0.8 }]}>
            סעיף {lastRead.sectionNumber}
          </Text>
        </View>
        <View style={[styles.arrow, { backgroundColor: colors.accent.teal }]}>
          <Text style={[styles.arrowText, { color: colors.text.onPrimary }]}>→</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: -36,
  },
  arrowText: {
    fontSize: 22,
    fontWeight: '700',
  },
});
