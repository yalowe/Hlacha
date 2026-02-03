import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { getAllParshiot, getParshiotByBook } from '@/utils/parshaLoader';
import { router } from 'expo-router';

export default function ShnayimMikraScreen() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const parshiotByBook = getParshiotByBook();

  const books = [
    { id: 'בראשית', name: 'בראשית', nameEn: 'Genesis' },
    { id: 'שמות', name: 'שמות', nameEn: 'Exodus' },
    { id: 'ויקרא', name: 'ויקרא', nameEn: 'Leviticus' },
    { id: 'במדבר', name: 'במדבר', nameEn: 'Numbers' },
    { id: 'דברים', name: 'דברים', nameEn: 'Deuteronomy' },
  ];

  if (!selectedBook) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              שניים מקרא ואחד תרגום
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              בחר ספר
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.booksGrid}>
            {books.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                onPress={() => setSelectedBook(book.id)}
              >
                <ThemedView style={styles.bookCardInner}>
                  <ThemedText type="subtitle" style={styles.bookName}>
                    {book.name}
                  </ThemedText>
                  <ThemedText style={styles.bookNameEn}>
                    {book.nameEn}
                  </ThemedText>
                  <ThemedText style={styles.parshaCount}>
                    {parshiotByBook[book.id as keyof typeof parshiotByBook]?.length || 0} פרשיות
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    );
  }

  const parshiot = parshiotByBook[selectedBook as keyof typeof parshiotByBook] || [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedBook(null)} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>← חזרה</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            {books.find(b => b.id === selectedBook)?.name}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.parshiotList}>
          {parshiot.map((parsha, index) => (
            <TouchableOpacity
              key={parsha.id}
              style={styles.parshaItem}
              onPress={() => router.push(`/parsha/${parsha.id}`)}
            >
              <ThemedView style={styles.parshaItemInner}>
                <ThemedView style={styles.parshaNumber}>
                  <ThemedText style={styles.parshaNumberText}>
                    {index + 1}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.parshaInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.parshaName}>
                    {parsha.name}
                  </ThemedText>
                  <ThemedText style={styles.parshaNameEn}>
                    {parsha.nameEn}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.arrow}>←</ThemedText>
              </ThemedView>
            </TouchableOpacity>
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
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  booksGrid: {
    padding: 16,
    gap: 16,
  },
  bookCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookCardInner: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  bookName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookNameEn: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  parshaCount: {
    fontSize: 14,
    opacity: 0.6,
  },
  parshiotList: {
    padding: 16,
  },
  parshaItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  parshaItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  parshaNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  parshaNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  parshaInfo: {
    flex: 1,
  },
  parshaName: {
    fontSize: 18,
    marginBottom: 2,
  },
  parshaNameEn: {
    fontSize: 14,
    opacity: 0.6,
  },
  arrow: {
    fontSize: 20,
    opacity: 0.3,
    marginLeft: 8,
  },
});
