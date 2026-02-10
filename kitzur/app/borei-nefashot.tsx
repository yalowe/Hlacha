import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Paragraph {
  paragraph: number;
  text: string;
  heading?: string;
  instruction?: string;
}

interface BoreiNefashot {
  name: string;
  hebrewName: string;
  category: string;
  description: string;
  paragraphs: Paragraph[];
}

export default function BoreiNefashotScreen() {
  const [blessing, setBlessing] = useState<BoreiNefashot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlessing();
  }, []);

  async function loadBlessing() {
    try {
      const data = require('@/content/special/borei_nefashot.json');
      setBlessing(data);
    } catch (error) {
      console.error('Error loading Borei Nefashot:', error);
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

  if (!blessing) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>לא נמצאה הברכה</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Modern gradient header */}
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={['#00D2D3', '#20B2AA', '#98FB98']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientHeader, { paddingTop: 60 }]}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="leaf" size={32} color="#fff" />
              </View>
              
              <ThemedText style={styles.parshaLabel}>ברכות הנהנין</ThemedText>
              
              <ThemedText style={styles.parshaName}>
                {blessing.hebrewName}
              </ThemedText>
              
              <ThemedText style={styles.subtitle}>
                בורא נפשות רבות
              </ThemedText>
              
              <View style={styles.divider} />
              
              <ThemedText style={styles.description}>
                {blessing.description}
              </ThemedText>
            </View>
          </LinearGradient>
        </View>

        <ThemedView style={styles.content}>
          {blessing.paragraphs.map((paragraph) => (
            <ThemedView key={paragraph.paragraph} style={styles.paragraphContainer}>
              {paragraph.heading && (
                <ThemedText style={styles.headingText}>
                  {paragraph.heading}
                </ThemedText>
              )}
              {paragraph.instruction && (
                <ThemedText style={styles.instructionText}>
                  {paragraph.instruction}
                </ThemedText>
              )}
              <ThemedText style={styles.paragraphText}>
                {paragraph.text}
              </ThemedText>
            </ThemedView>
          ))}
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
  description: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
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
    fontSize: 28,
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
  content: {
    padding: 20,
  },
  paragraphContainer: {
    marginBottom: 24,
  },
  headingText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
    color: '#007AFF',
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
    backgroundColor: '#FFF3CD',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  paragraphText: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: 'right',
    fontFamily: 'System',
  },
});
