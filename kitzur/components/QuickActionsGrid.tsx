import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
}

export function QuickActionButton({ icon, label, onPress }: QuickActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable 
      style={[styles.button, { backgroundColor: colors.surface.card }]}
      onPress={onPress}
      android_ripple={{ color: colors.primary.light }}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary.light }]}>
        <Text style={[styles.icon, { color: colors.primary.main }]}>{icon}</Text>
      </View>
      <Text style={[styles.label, { color: colors.text.primary }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

interface QuickActionsGridProps {
  onBrowse: () => void;
  onSearch: () => void;
  onBookmarks: () => void;
  onDailyHalacha: () => void;
  onShnayimMikra?: () => void;
  onParshatHaMann?: () => void;
  onIggeretHaRamban?: () => void;
  onBirkatHaMazon?: () => void;
  onBoreiNefashot?: () => void;
  onMeeinShalosh?: () => void;
}

export function QuickActionsGrid({ onBrowse, onSearch, onBookmarks, onDailyHalacha, onShnayimMikra, onParshatHaMann, onIggeretHaRamban, onBirkatHaMazon, onBoreiNefashot, onMeeinShalosh }: QuickActionsGridProps) {
  return (
    <View style={styles.grid}>
      <QuickActionButton icon="📖" label="שולחן ערוך" onPress={onBrowse} />
      <QuickActionButton icon="🔍" label="חיפוש" onPress={onSearch} />
      <QuickActionButton icon="⭐" label="סימניות" onPress={onBookmarks} />
      <QuickActionButton icon="📅" label="הלכה יומית" onPress={onDailyHalacha} />
      {onShnayimMikra && (
        <QuickActionButton icon="📜" label="שניים מקרא" onPress={onShnayimMikra} />
      )}
      {onParshatHaMann && (
        <QuickActionButton icon="🍞" label="פרשת המן" onPress={onParshatHaMann} />
      )}
      {onIggeretHaRamban && (
        <QuickActionButton icon="✉️" label="איגרת הרמבן" onPress={onIggeretHaRamban} />
      )}
      {onBirkatHaMazon && (
        <QuickActionButton icon="🍽️" label="ברכת המזון" onPress={onBirkatHaMazon} />
      )}
      {onBoreiNefashot && (
        <QuickActionButton icon="🌱" label="בורא נפשות" onPress={onBoreiNefashot} />
      )}
      {onMeeinShalosh && (
        <QuickActionButton icon="🍇" label="מעין שלוש" onPress={onMeeinShalosh} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: -6,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
