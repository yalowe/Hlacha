import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface DailyQuoteCardProps {
  text: string;
  source: string;
}

export function DailyQuoteCard({ text, source }: DailyQuoteCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.accent.teal }]}>
      <Text style={[styles.label, { color: colors.text.onPrimary }]}>
        ציטוט יומי
      </Text>
      <Text style={[styles.quote, { color: colors.text.onPrimary }]}>
        &quot;{text}&quot;
      </Text>
      <Text style={[styles.source, { color: colors.text.onPrimary, opacity: 0.8 }]}>
        — {source}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'right',
  },
  source: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
  },
});
