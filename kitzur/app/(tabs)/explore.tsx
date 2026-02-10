/**
 * Explore Screen - Search, Bookmarks, and Settings
 */
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, View, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { resetAllProgress } from '@/utils/progress';
import { getDeviceId, resetDeviceId } from '@/utils/deviceId';
import { verifyAdminCode, isSuperAdmin } from '@/utils/adminAuth';
import { Colors, spacing } from '@/constants/theme';

export default function ExploreScreen() {
  const [deviceId, setDeviceId] = useState<string>('');
  const [adminCode, setAdminCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { textSize, setTextSize, themeMode, setThemeMode } = useApp();

  useEffect(() => {
    loadDeviceId();
    checkAdminStatus();
  }, []);

  async function loadDeviceId() {
    const id = await getDeviceId();
    setDeviceId(id);
  }

  async function checkAdminStatus() {
    const admin = await isSuperAdmin();
    setIsAdmin(admin);
  }

  async function handleAdminCodeSubmit() {
    if (!adminCode.trim()) {
      Alert.alert('שגיאה', 'נא להזין קוד מנהל');
      return;
    }

    const success = await verifyAdminCode(adminCode);
    
    if (success) {
      setIsAdmin(true);
      setAdminCode('');
      Alert.alert(
        '✅ הצלחה!',
        'קיבלת הרשאות SuperAdmin!\n\nעכשיו תוכל:\n• לנהל משתמשים\n• לאשר תשובות\n• לערוך תוכן\n• לתת הרשאות לאחרים',
        [{ text: 'מעולה!' }]
      );
    } else {
      Alert.alert(
        '❌ קוד שגוי',
        'הקוד שהזנת אינו נכון. נסה שוב או פנה למנהל המערכת.',
        [{ text: 'אישור' }]
      );
    }
  }

  async function handleResetRatings() {
    Alert.alert(
      'איפוס דירוגים',
      'פעולה זו תאפס את כל הדירוגים שנתת לתשובות. תוכל לדרג מחדש את כל השאלות. האם להמשיך?',
      [
        {
          text: 'ביטול',
          style: 'cancel',
        },
        {
          text: 'אפס דירוגים',
          style: 'destructive',
          onPress: async () => {
            const newId = await resetDeviceId();
            setDeviceId(newId);
            Alert.alert('הושלם', 'הדירוגים אופסו בהצלחה. תוכל לדרג מחדש את השאלות.');
          },
        },
      ]
    );
  }

  async function handleResetProgress() {
    Alert.alert(
      'איפוס התקדמות',
      'האם אתה בטוח שברצונך לאפס את כל ההתקדמות? פעולה זו תמחק את כל הסימנים שסומנו כהושלמו, את מיקום הקריאה האחרון ואת רצף הלימוד היומי.',
      [
        {
          text: 'ביטול',
          style: 'cancel',
        },
        {
          text: 'אפס',
          style: 'destructive',
          onPress: async () => {
            await resetAllProgress();
            Alert.alert('הושלם', 'ההתקדמות אופסה בהצלחה');
          },
        },
      ]
    );
  }

  const textSizes: { value: typeof textSize; label: string }[] = [
    { value: 'small', label: 'קטן' },
    { value: 'medium', label: 'בינוני' },
    { value: 'large', label: 'גדול' },
    { value: 'xlarge', label: 'גדול מאוד' },
  ];

  const themes: { value: typeof themeMode; label: string }[] = [
    { value: 'light', label: 'בהיר' },
    { value: 'dark', label: 'כהה' },
    { value: 'system', label: 'אוטומטי' },
  ];

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          גודל טקסט
        </ThemedText>
        <View style={styles.optionsRow}>
          {textSizes.map((size) => (
            <Pressable
              key={size.value}
              style={[
                styles.optionButton,
                textSize === size.value && styles.optionButtonActive,
              ]}
              onPress={() => setTextSize(size.value)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  textSize === size.value && styles.optionTextActive,
                ]}
              >
                {size.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          ערכת צבעים
        </ThemedText>
        <View style={styles.optionsRow}>
          {themes.map((theme) => (
            <Pressable
              key={theme.value}
              style={[
                styles.optionButton,
                themeMode === theme.value && styles.optionButtonActive,
              ]}
              onPress={() => setThemeMode(theme.value)}
            >
              <ThemedText
                style={[
                  styles.optionText,
                  themeMode === theme.value && styles.optionTextActive,
                ]}
              >
                {theme.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      {/* Admin Access Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          🔐 גישת מנהל
        </ThemedText>
        
        {isAdmin ? (
          <View style={styles.adminStatusContainer}>
            <View style={[styles.adminBadge, { backgroundColor: Colors.light.semantic.success + '20' }]}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.light.semantic.success} />
              <ThemedText style={[styles.adminBadgeText, { color: Colors.light.semantic.success }]}>
                SuperAdmin פעיל
              </ThemedText>
            </View>
            <ThemedText style={styles.adminInfo}>
              יש לך הרשאות מלאות במערכת:
              {'\n'}• ניהול משתמשים
              {'\n'}• אישור ועריכת תשובות
              {'\n'}• מתן הרשאות לאחרים
            </ThemedText>
          </View>
        ) : (
          <View style={styles.adminCodeContainer}>
            <ThemedText style={styles.adminCodeLabel}>
              הזן קוד סודי לקבלת הרשאות מנהל:
            </ThemedText>
            <View style={styles.adminCodeInputRow}>
              <TextInput
                style={styles.adminCodeInput}
                placeholder="הזן קוד מנהל"
                placeholderTextColor="#999999"
                value={adminCode}
                onChangeText={setAdminCode}
                secureTextEntry
                autoCapitalize="characters"
              />
              <Pressable 
                style={styles.adminCodeButton}
                onPress={handleAdminCodeSubmit}
              >
                <Ionicons name="lock-open" size={20} color="white" />
                <ThemedText style={styles.adminCodeButtonText}>
                  אשר
                </ThemedText>
              </Pressable>
            </View>
            <ThemedText style={styles.adminCodeHint}>
              💡 רק מנהלי המערכת מורשים לגשת למצב זה.
              {'\n'}אם אתה מנהל, הזן את הקוד שקיבלת.
            </ThemedText>
          </View>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          ניהול נתונים
        </ThemedText>
        
        {/* Device ID Info */}
        <View style={styles.deviceIdContainer}>
          <ThemedText style={styles.deviceIdLabel}>
            📱 מזהה מכשיר (למניעת דירוג כפול)
          </ThemedText>
          <ThemedText style={styles.deviceIdText} numberOfLines={1}>
            {deviceId || 'טוען...'}
          </ThemedText>
          <ThemedText style={styles.deviceIdNote}>
            מזהה ייחודי שנוצר אוטומטית למניעת דירוג כפול של אותה תשובה
          </ThemedText>
        </View>

        {/* Reset Ratings Button */}
        <Pressable 
          style={styles.resetButton}
          onPress={handleResetRatings}
        >
          <Ionicons name="star-outline" size={20} color={Colors.light.semantic.warning} />
          <ThemedText style={[styles.resetButtonText, { color: Colors.light.semantic.warning }]}>
            אפס את כל הדירוגים (שאלות ותשובות)
          </ThemedText>
        </Pressable>
        <ThemedText style={styles.resetWarning}>
          תוכל לדרג מחדש את כל השאלות אחרי האיפוס
        </ThemedText>

        {/* Reset Progress Button */}
        <Pressable 
          style={[styles.resetButton, { marginTop: 12 }]}
          onPress={handleResetProgress}
        >
          <Ionicons name="refresh" size={20} color={Colors.light.semantic.error} />
          <ThemedText style={styles.resetButtonText}>
            אפס את כל ההתקדמות
          </ThemedText>
        </Pressable>
        <ThemedText style={styles.resetWarning}>
          פעולה זו תמחק את כל הסימנים שסומנו כהושלמו ואת רצף הלימוד היומי
        </ThemedText>

        {/* Admin Testing Button */}
        <Pressable 
          style={[styles.resetButton, { marginTop: 16, backgroundColor: Colors.light.primary.light }]}
          onPress={() => router.push('/admin-testing')}
        >
          <Ionicons name="shield-checkmark" size={20} color={Colors.light.primary.dark} />
          <ThemedText style={[styles.resetButtonText, { color: Colors.light.primary.dark }]}>
            🔐 בדיקת מערכת הרשאות
          </ThemedText>
        </Pressable>
        <ThemedText style={styles.resetWarning}>
          דף בדיקה למערכת הרשאות ואישורים (פיתוח)
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.versionText}>
          גרסה 1.2.0
        </ThemedText>
        <Pressable
          style={[styles.resetButton, { marginTop: 18, backgroundColor: Colors.light.primary.main, borderColor: Colors.light.primary.main }]}
          onPress={() => router.push('about' as typeof router.push extends (path: infer P, ...args: any[]) => any ? P : never)}
        >
          <Ionicons name="information-circle-outline" size={20} color={Colors.light.text.onPrimary} />
          <ThemedText style={[styles.resetButtonText, { color: Colors.light.text.onPrimary }]}>אודות האפליקציה</ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.base,
  },
  section: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border.default,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'right',
    color: Colors.light.text.primary,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border.default,
    backgroundColor: Colors.light.background.surface,
  },
  optionButtonActive: {
    backgroundColor: Colors.light.primary.main,
    borderColor: Colors.light.primary.main,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  optionTextActive: {
    color: Colors.light.text.onPrimary,
  },
  versionText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.text.secondary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: Colors.light.semantic.error + '15',
    borderWidth: 1,
    borderColor: Colors.light.semantic.error,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.semantic.error,
  },
  resetWarning: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  deviceIdContainer: {
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.light.background.surface,
    borderWidth: 1,
    borderColor: Colors.light.border.default,
    marginBottom: 16,
  },
  deviceIdLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text.primary,
    marginBottom: 8,
  },
  deviceIdText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.light.primary.main,
    backgroundColor: Colors.light.primary.light,
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  deviceIdNote: {
    fontSize: 11,
    color: Colors.light.text.secondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  adminStatusContainer: {
    gap: 12,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: 12,
  },
  adminBadgeText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  adminInfo: {
    fontSize: 14,
    color: Colors.light.text.secondary,
    lineHeight: 22,
    padding: spacing.md,
    backgroundColor: Colors.light.background.surface,
    borderRadius: 8,
  },
  adminCodeContainer: {
    gap: 12,
  },
  adminCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text.primary,
  },
  adminCodeInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  adminCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.border.default,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.light.background.surface,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  adminCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  adminCodeButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  adminCodeHint: {
    fontSize: 12,
    color: Colors.light.text.secondary,
    lineHeight: 18,
    padding: 12,
    backgroundColor: Colors.light.primary.light,
    borderRadius: 8,
    borderRightWidth: 3,
    borderRightColor: Colors.light.primary.main,
  },
});
