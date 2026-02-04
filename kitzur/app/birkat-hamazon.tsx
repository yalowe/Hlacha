import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';

interface Paragraph {
  paragraph: number;
  text: string;
  heading?: string;
  instruction?: string;
}

interface BirkatHaMazon {
  name: string;
  hebrewName: string;
  category: string;
  description: string;
  paragraphs: Paragraph[];
}

export default function BirkatHaMazonScreen() {
  const [birkat, setBirkat] = useState<BirkatHaMazon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBirkat();
  }, []);

  async function loadBirkat() {
    try {
      const data = require('@/content/special/birkat_hamazon.json');
      setBirkat(data);
    } catch (error) {
      console.error('Error loading Birkat HaMazon:', error);
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

  if (!birkat) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>לא נמצאה ברכת המזון</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {birkat.hebrewName}
          </ThemedText>
          <ThemedText style={styles.description}>
            {birkat.description}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          {birkat.paragraphs.map((paragraph) => (
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
