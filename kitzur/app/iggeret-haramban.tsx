import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';

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
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {letter.hebrewName}
          </ThemedText>
          <ThemedText style={styles.author}>
            {letter.author}
          </ThemedText>
          <ThemedText style={styles.description}>
            {letter.description}
          </ThemedText>
        </ThemedView>

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
