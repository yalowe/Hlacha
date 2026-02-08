import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface StreakCounterProps {
  count: number;
}

export function StreakCounter({ count }: StreakCounterProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface.card }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.accent.bronze + '20' }]}>
        <Text style={styles.icon}>🔥</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.count, { color: colors.text.primary }]}>
          {count} {count === 1 ? 'יום' : 'ימים'}
        </Text>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          רצף לימוד
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  count: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
