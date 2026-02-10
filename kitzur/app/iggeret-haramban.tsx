import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Paragraph {
  paragraph: number;
  text: string;
}

interface IggeretHaRamban {
  name: string;
  hebrewName: string;
  author: string;
  description: string;
  paragraphs: Paragraph[];
}

export default function IggeretHaRambanScreen() {
  const [letter, setLetter] = useState<IggeretHaRamban | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIggeret();
  }, []);

  async function loadIggeret() {
    try {
      const data = require('@/content/special/iggeret_haramban.json');
      setLetter(data);
    } catch (error) {
      console.error('Error loading Iggeret HaRamban:', error);
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

  if (!letter) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>לא נמצאה האיגרת</ThemedText>
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
            colors={['#74B9FF', '#4A90E2', '#2C5FFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientHeader, { paddingTop: 60 }]}
          >
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="document-text" size={32} color="#fff" />
              </View>
              
              <ThemedText style={styles.parshaLabel}>מוסר והדרכה</ThemedText>
              
              <ThemedText style={styles.parshaName}>
                {letter.hebrewName}
              </ThemedText>
              
              <ThemedText style={styles.subtitle}>
                {letter.author}
              </ThemedText>
              
              <View style={styles.divider} />
              
              <ThemedText style={styles.description}>
                {letter.description}
              </ThemedText>
            </View>
          </LinearGradient>
        </View>

        <ThemedView style={styles.content}>
          {letter.paragraphs.map((paragraph) => (
            <ThemedView key={paragraph.paragraph} style={styles.paragraphContainer}>
              <ThemedText style={styles.paragraphText}>
                {paragraph.text}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            מִנְהָג לִקְרוֹא אִגֶּרֶת זוֹ פַּעַם אַחַת בְּשָׁבוּעַ
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
  author: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
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
  content: {
    padding: 20,
  },
  paragraphContainer: {
    marginBottom: 20,
  },
  paragraphText: {
    fontSize: 17,
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: 'System',
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
