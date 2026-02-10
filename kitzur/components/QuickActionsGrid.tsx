import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  badge?: number | 'new';
}

function QuickActionButton({ icon, label, onPress, badge }: QuickActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable 
      style={[styles.button, { backgroundColor: colors.surface.card }]}
      onPress={onPress}
      android_ripple={{ color: colors.primary.light }}
    >
      <View style={styles.iconWrapper}>
        <LinearGradient
          colors={['#4A90E2', '#74B9FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Text style={styles.icon}>{icon}</Text>
        </LinearGradient>
        {badge && (
          <View style={[styles.badge, { backgroundColor: '#FF3B30' }]}>
            <Text style={styles.badgeText}>
              {typeof badge === 'number' ? (badge > 9 ? '9+' : badge.toString()) : '•'}
            </Text>
          </View>
        )}
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
  onQuestions?: () => void;
  onAddSection?: () => void;
  questionsCount?: number;
  pendingAnswersCount?: number;
}

export function QuickActionsGrid({ 
  onBrowse, 
  onSearch, 
  onBookmarks, 
  onDailyHalacha, 
  onShnayimMikra, 
  onParshatHaMann, 
  onIggeretHaRamban, 
  onBirkatHaMazon, 
  onBoreiNefashot, 
  onMeeinShalosh, 
  onQuestions, 
  onAddSection,
  questionsCount = 0,
  pendingAnswersCount = 0
}: QuickActionsGridProps) {
  // Calculate total badge count (unanswered + pending answers)
  const totalBadgeCount = questionsCount + pendingAnswersCount;
  
  return (
    <View style={styles.grid}>
      <QuickActionButton icon="📖" label="שולחן ערוך - מרן" onPress={onBrowse} />
      <QuickActionButton icon="🔍" label="חיפוש" onPress={onSearch} />
      <QuickActionButton icon="⭐" label="סימניות שמורות" onPress={onBookmarks} />
      <QuickActionButton icon="📅" label="הלכה יומית" onPress={onDailyHalacha} />
      {onQuestions && (
        <QuickActionButton 
          icon="💬" 
          label="שאלות ותשובות" 
          onPress={onQuestions}
          badge={totalBadgeCount > 0 ? totalBadgeCount : undefined}
        />
      )}
      {onAddSection && (
        <QuickActionButton icon="✍️" label="הוסף הלכה" onPress={onAddSection} />
      )}
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
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 10,
    marginTop: -12,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 26,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
