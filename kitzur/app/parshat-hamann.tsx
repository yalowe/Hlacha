import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';
import { toHebrewNumeral } from '@/utils/hebrewNumbers';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Verse {
  verseNum: number;
  hebrew: string;
  targum: string;
  english?: string;
}

interface ParshatHaMann {
  name: string;
  hebrewName: string;
  book: string;
  description: string;
  chapters: {
    chapter: number;
    verses: Verse[];
  }[];
}

export default function ParshatHaMannScreen() {
  const [parsha, setParsha] = useState<ParshatHaMann | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParshatHaMann();
  }, []);

  async function loadParshatHaMann() {
    try {
      const data = require('@/content/special/parshat_hamann.json');
      setParsha(data);
    } catch (error) {
      console.error('Error loading Parshat HaMann:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>טוען...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!parsha) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>לא נמצאה פרשת המן</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const chapter = parsha.chapters[0];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Modern gradient header */}
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={['#00D2D3', '#4A90E2', '#74B9FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientHeader, { paddingTop: 10 }]}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="gift" size={32} color="#fff" />
              </View>
              
              <ThemedText style={styles.parshaLabel}>פרשת מיוחדת</ThemedText>
              
              <ThemedText style={styles.parshaName}>
                {parsha.hebrewName}
              </ThemedText>
              
              <ThemedText style={styles.subtitle}>
                שמות טז:ד-לו
              </ThemedText>
              
              <View style={styles.divider} />
              
              <ThemedText style={styles.description}>
                {parsha.description}
              </ThemedText>
            </View>
          </LinearGradient>
        </View>

        <ThemedView style={styles.content}>
          {chapter.verses.map((verse) => (
            <ThemedView key={verse.verseNum} style={styles.verseContainer}>
              <ThemedView style={styles.verseNumber}>
                <ThemedText style={styles.verseNumberText}>
                  {toHebrewNumeral(verse.verseNum)}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.verseContent}>
                {/* Hebrew text - first reading */}
                <ThemedView style={styles.textBlock}>
                  <ThemedText style={styles.label}>עברי (א&apos;)</ThemedText>
                  <ThemedText style={styles.hebrewText}>
                    {verse.hebrew}
                  </ThemedText>
                </ThemedView>

                {/* Hebrew text - second reading */}
                <ThemedView style={styles.textBlock}>
                  <ThemedText style={styles.label}>עברי (ב&apos;)</ThemedText>
                  <ThemedText style={styles.hebrewText}>
                    {verse.hebrew}
                  </ThemedText>
                </ThemedView>

                {/* Targum text */}
                <ThemedView style={styles.textBlock}>
                  <ThemedText style={styles.label}>תרגום</ThemedText>
                  <ThemedText style={styles.targumText}>
                    {verse.targum}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            רבי מנחם מנדל מריימאנוב אמר: &quot;המשלים קריאת פרשת המן בכל יום, מובטח לו שלא יחסר לו פרנסתו&quot;
          </ThemedText>
        </ThemedView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  reference: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  content: {
    padding: 16,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  verseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  verseNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verseContent: {
    flex: 1,
  },
  textBlock: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 4,
  },
  hebrewText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: 'System',
  },
  targumText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'right',
    fontFamily: 'System',
    opacity: 0.8,
  },
  /* Modern Header Styles */
  headerWrapper: {
    marginBottom: 0,
  },
  gradientHeader: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingBottom: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  parshaLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: 8,
    textAlign: 'center',
  },
  parshaName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 60,
    marginBottom: 16,
    borderRadius: 1,
  },
  description: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.85,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
