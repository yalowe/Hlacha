/**
 * Add New Section Screen
 * Form to add new content to Shulchan Aruch
 */
import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fromHebrewNumeral } from '@/utils/hebrewNumbers';

type BookType = 'orach_chaim' | 'yoreh_deah' | 'even_haezer' | 'choshen_mishpat' | 'other';

const BOOK_LABELS: Record<BookType, string> = {
  orach_chaim: 'אורח חיים',
  yoreh_deah: 'יורה דעה',
  even_haezer: 'אבן העזר',
  choshen_mishpat: 'חושן משפט',
  other: 'אחר'
};

export default function AddSectionScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Form state
  const [book, setBook] = useState<BookType>('orach_chaim');
  const [customBookName, setCustomBookName] = useState('');
  const [siman, setSiman] = useState('');
  const [seif, setSeif] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    if (book === 'other' && !customBookName.trim()) {
      Alert.alert('❌ שגיאה', 'חובה להזין שם הספר');
      return false;
    }
    if (!siman.trim()) {
      Alert.alert('❌ שגיאה', 'חובה להזין מספר סימן');
      return false;
    }
    if (!seif.trim()) {
      Alert.alert('❌ שגיאה', 'חובה להזין מספר סעיף');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('❌ שגיאה', 'חובה להזין כותרת');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('❌ שגיאה', 'חובה להזין תוכן הסעיף');
      return false;
    }
    if (content.length < 10) {
      Alert.alert('❌ שגיאה', 'תוכן הסעיף קצר מדי (מינימום 10 תווים)');
      return false;
    }

    // Validate numbers - support both Hebrew and Arabic numerals
    let simanNum = parseInt(siman, 10);
    if (isNaN(simanNum)) {
      simanNum = fromHebrewNumeral(siman);
    }
    
    let seifNum = parseInt(seif, 10);
    if (isNaN(seifNum)) {
      seifNum = fromHebrewNumeral(seif);
    }

    if (isNaN(simanNum) || simanNum < 1 || simanNum > 1000) {
      Alert.alert('❌ שגיאה', 'מספר סימן לא תקין (1-1000 או א-תתק)');
      return false;
    }
    if (isNaN(seifNum) || seifNum < 1 || seifNum > 100) {
      Alert.alert('❌ שגיאה', 'מספר סעיף לא תקין (1-100 או א-ק)');
      return false;
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      // Determine book name
      const bookName = book === 'other' ? customBookName.trim() : book;
      
      // Parse numbers (support Hebrew numerals)
      let simanNum = parseInt(siman, 10);
      if (isNaN(simanNum)) {
        simanNum = fromHebrewNumeral(siman);
      }
      
      let seifNum = parseInt(seif, 10);
      if (isNaN(seifNum)) {
        seifNum = fromHebrewNumeral(seif);
      }
      
      // Generate unique ID
      const id = `${bookName.replace(/\s+/g, '_')}-${simanNum.toString().padStart(3, '0')}-${seifNum.toString().padStart(2, '0')}`;

      // Create section object
      const newSection = {
        id,
        book: bookName,
        bookLabel: book === 'other' ? customBookName.trim() : BOOK_LABELS[book],
        siman: simanNum,
        seif: seifNum,
        title: title.trim(),
        content: content.trim(),
        tags: tags
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
        source: source.trim() || 'תוספת משתמש',
        dateAdded: Date.now(),
        status: 'pending' // Will be reviewed before appearing in app
      };

      // Save to AsyncStorage (pending sections)
      const PENDING_KEY = '@kitzur_pending_sections';
      const existing = await AsyncStorage.getItem(PENDING_KEY);
      const pendingSections = existing ? JSON.parse(existing) : [];
      pendingSections.push(newSection);
      await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(pendingSections));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Success message
      Alert.alert(
        '✅ נשמר בהצלחה!',
        'הסעיף נשמר ויעבור בדיקה לפני הוספה לאפליקציה.\n\nתודה על התרומה! 💙',
        [
          {
            text: 'הוסף עוד',
            onPress: () => {
              // Clear form
              setBook('orach_chaim');
              setCustomBookName('');
              setSiman('');
              setSeif('');
              setTitle('');
              setContent('');
              setTags('');
              setSource('');
            }
          },
          {
            text: 'חזור',
            onPress: () => router.back(),
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Failed to save section:', error);
      Alert.alert('❌ שגיאה', 'לא הצלחנו לשמור את הסעיף. נסה שוב.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background.base }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.form}>
          {/* Book Selection */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: colors.text.primary }]}>
              📚 ספר *
            </ThemedText>
            <View style={styles.bookGrid}>
              {(Object.keys(BOOK_LABELS) as BookType[]).map((bookType) => (
                <Pressable
                  key={bookType}
                  style={[
                    styles.bookChip,
                    { backgroundColor: colors.surface.card },
                    book === bookType && { 
                      backgroundColor: colors.primary.main,
                      borderWidth: 2,
                      borderColor: colors.primary.dark
                    }
                  ]}
                  onPress={() => {
                    setBook(bookType);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <ThemedText
                    style={[
                      styles.bookText,
                      { color: colors.text.primary },
                      book === bookType && { color: colors.text.onPrimary, fontWeight: '700' }
                    ]}
                  >
                    {BOOK_LABELS[bookType]}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Custom Book Name (if "Other" selected) */}
          {book === 'other' && (
            <View style={styles.section}>
              <ThemedText style={[styles.label, { color: colors.text.primary }]}>
                📖 שם הספר *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surface.card,
                    color: colors.text.primary,
                    borderColor: colors.border.default
                  }
                ]}
                placeholder="לדוגמה: מסכת שבת, רמב״ם הלכות שבת..."
                placeholderTextColor={colors.text.secondary}
                value={customBookName}
                onChangeText={setCustomBookName}
                textAlign="right"
              />
            </View>
          )}

          {/* Siman & Seif Numbers */}
          <View style={styles.row}>
            <View style={[styles.halfWidth, { marginLeft: spacing.sm }]}>
              <ThemedText style={[styles.label, { color: colors.text.primary }]}>
                � סימן *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surface.card,
                    color: colors.text.primary,
                    borderColor: colors.border.default
                  }
                ]}
                placeholder="לדוגמה: ע״ה או 75"
                placeholderTextColor={colors.text.secondary}
                value={siman}
                onChangeText={setSiman}
                textAlign="right"
              />
            </View>

            <View style={styles.halfWidth}>
              <ThemedText style={[styles.label, { color: colors.text.primary }]}>
                📜 סעיף *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surface.card,
                    color: colors.text.primary,
                    borderColor: colors.border.default
                  }
                ]}
                placeholder="לדוגמה: א׳ או 1"
                placeholderTextColor={colors.text.secondary}
                value={seif}
                onChangeText={setSeif}
                textAlign="right"
              />
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: colors.text.primary }]}>
              ✏️ כותרת הסעיף *
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surface.card,
                  color: colors.text.primary,
                  borderColor: colors.border.default
                }
              ]}
              placeholder="לדוגמה: הדלקת נרות שבת"
              placeholderTextColor={colors.text.secondary}
              value={title}
              onChangeText={setTitle}
              textAlign="right"
            />
          </View>

          {/* Content */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: colors.text.primary }]}>
              📖 תוכן הסעיף *
            </ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: colors.surface.card,
                  color: colors.text.primary,
                  borderColor: colors.border.default
                }
              ]}
              placeholder="הזן את תוכן הסעיף המלא..."
              placeholderTextColor={colors.text.secondary}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={10}
              textAlign="right"
              textAlignVertical="top"
            />
            <ThemedText style={[styles.charCount, { color: colors.text.secondary }]}>
              {content.length} תווים
            </ThemedText>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: colors.text.primary }]}>
              🏷️ תגיות (מופרדות בפסיק)
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surface.card,
                  color: colors.text.primary,
                  borderColor: colors.border.default
                }
              ]}
              placeholder="לדוגמה: שבת, נרות, תפילה"
              placeholderTextColor={colors.text.secondary}
              value={tags}
              onChangeText={setTags}
              textAlign="right"
            />
          </View>

          {/* Source */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: colors.text.primary }]}>
              📚 מקור (אופציונלי)
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surface.card,
                  color: colors.text.primary,
                  borderColor: colors.border.default
                }
              ]}
              placeholder="לדוגמה: משנה ברורה סעיף קטן ה"
              placeholderTextColor={colors.text.secondary}
              value={source}
              onChangeText={setSource}
              textAlign="right"
            />
          </View>

          {/* Info Box */}
          <View style={[styles.infoBox, { backgroundColor: colors.primary.light }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary.main} />
            <ThemedText style={[styles.infoText, { color: colors.text.primary }]}>
              * שדות חובה{'\n'}
              הסעיף יעבור בדיקה לפני הוספה לאפליקציה
            </ThemedText>
          </View>

          {/* Submit Button */}
          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: colors.accent.bronze },
              submitting && { opacity: 0.6 }
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            <ThemedText style={styles.submitText}>
              {submitting ? '⏳ שומר...' : '✅ שמור סעיף'}
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 40,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    textAlign: 'right',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    textAlign: 'right',
    minHeight: 150,
  },
  charCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'left',
  },
  bookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  bookChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  bookText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md + 2,
    borderRadius: 12,
    gap: spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
