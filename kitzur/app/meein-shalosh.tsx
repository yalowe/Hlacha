import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useEffect } from 'react';

interface Part {
  instruction?: string;
  text?: string;
  optional?: boolean;
  condition?: string;
  parts?: Part[];
}

interface Paragraph {
  paragraph: number;
  text?: string;
  heading?: string;
  instruction?: string;
  parts?: Part[];
}

interface MeeinShalosh {
  name: string;
  hebrewName: string;
  category: string;
  description: string;
  paragraphs: Paragraph[];
}

export default function MeeinShaloshScreen() {
  const [blessing, setBlessing] = useState<MeeinShalosh | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlessing();
  }, []);

  async function loadBlessing() {
    try {
      const data = require('@/content/special/meein_shalosh.json');
      setBlessing(data);
    } catch (error) {
      console.error('Error loading Me\'ein Shalosh:', error);
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
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {blessing.hebrewName}
          </ThemedText>
          <ThemedText style={styles.description}>
            {blessing.description}
          </ThemedText>
        </ThemedView>

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
              
              {paragraph.parts ? (
                paragraph.parts.map((part, index) => (
                  <ThemedView key={index} style={styles.partContainer}>
                    {part.instruction && (
                      <ThemedText style={styles.partInstructionText}>
                        {part.instruction}
                      </ThemedText>
                    )}
                    {part.parts ? (
                      part.parts.map((subPart, subIndex) => (
                        <ThemedText key={subIndex} style={subPart.optional ? styles.optionalText : styles.paragraphText}>
                          {subPart.optional && subPart.condition && `${subPart.condition}: `}
                          {subPart.text}
                        </ThemedText>
                      ))
                    ) : part.optional ? (
                      <ThemedText style={styles.optionalText}>
                        {part.condition}: {part.text}
                      </ThemedText>
                    ) : part.text ? (
                      <ThemedText style={styles.paragraphText}>
                        {part.text}
                      </ThemedText>
                    ) : null}
                  </ThemedView>
                ))
              ) : (
                paragraph.text && (
                  <ThemedText style={styles.paragraphText}>
                    {paragraph.text}
                  </ThemedText>
                )
              )}
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
  partContainer: {
    marginBottom: 16,
  },
  partInstructionText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'right',
    color: '#007AFF',
    fontStyle: 'italic',
  },
  optionalText: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
    color: '#007AFF',
    fontStyle: 'italic',
  },
});
