import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  badge?: number | 'new';
  gradientColors?: [string, string];
}

export function QuickActionButton({ icon, label, onPress, badge, gradientColors }: QuickActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const defaultGradient: [string, string] = ['#4A90E2', '#74B9FF'];
  const gradient = gradientColors || defaultGradient;

  return (
    <Pressable 
      style={[styles.button, { backgroundColor: colors.surface.card }]}
      onPress={onPress}
      android_ripple={{ color: colors.primary.light }}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        <Ionicons name={icon} size={28} color="#fff" />
        {badge && (
          <View style={[styles.badge, { backgroundColor: '#FF3B30' }]}>
            <Text style={styles.badgeText}>
              {typeof badge === 'number' ? (badge > 9 ? '9+' : badge.toString()) : '•'}
            </Text>
          </View>
        )}
      </LinearGradient>
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
      <QuickActionButton 
        icon="book" 
        label="שולחן ערוך - מרן" 
        onPress={onBrowse}
        gradientColors={['#4A90E2', '#74B9FF']}
      />
      <QuickActionButton 
        icon="search" 
        label="חיפוש" 
        onPress={onSearch}
        gradientColors={['#B394E8', '#D4A5E8']}
      />
      <QuickActionButton 
        icon="star" 
        label="סימניות שמורות" 
        onPress={onBookmarks}
        gradientColors={['#74B9FF', '#9DCCFF']}
      />
      <QuickActionButton 
        icon="calendar" 
        label="הלכה יומית" 
        onPress={onDailyHalacha}
        gradientColors={['#4A90E2', '#B394E8']}
      />
      {onQuestions && (
        <QuickActionButton 
          icon="chatbubbles" 
          label="שאלות ותשובות" 
          onPress={onQuestions}
          badge={totalBadgeCount > 0 ? totalBadgeCount : undefined}
          gradientColors={['#74B9FF', '#4A90E2']}
        />
      )}
      {onAddSection && (
        <QuickActionButton 
          icon="add-circle" 
          label="הוסף הלכה" 
          onPress={onAddSection}
          gradientColors={['#B394E8', '#74B9FF']}
        />
      )}
      {onShnayimMikra && (
        <QuickActionButton 
          icon="document-text" 
          label="שניים מקרא" 
          onPress={onShnayimMikra}
          gradientColors={['#4A90E2', '#74B9FF']}
        />
      )}
      {onParshatHaMann && (
        <QuickActionButton 
          icon="nutrition" 
          label="פרשת המן" 
          onPress={onParshatHaMann}
          gradientColors={['#B394E8', '#D4A5E8']}
        />
      )}
      {onIggeretHaRamban && (
        <QuickActionButton 
          icon="mail" 
          label="איגרת הרמבן" 
          onPress={onIggeretHaRamban}
          gradientColors={['#74B9FF', '#9DCCFF']}
        />
      )}
      {onBirkatHaMazon && (
        <QuickActionButton 
          icon="restaurant" 
          label="ברכת המזון" 
          onPress={onBirkatHaMazon}
          gradientColors={['#4A90E2', '#B394E8']}
        />
      )}
      {onBoreiNefashot && (
        <QuickActionButton 
          icon="leaf" 
          label="בורא נפשות" 
          onPress={onBoreiNefashot}
          gradientColors={['#74B9FF', '#4A90E2']}
        />
      )}
      {onMeeinShalosh && (
        <QuickActionButton 
          icon="wine" 
          label="מעין שלוש" 
          onPress={onMeeinShalosh}
          gradientColors={['#B394E8', '#74B9FF']}
        />
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
    elevation: 4,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: -12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
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
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
