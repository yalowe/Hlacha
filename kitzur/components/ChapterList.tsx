/**
 * ChapterList Component
 * Displays a list of chapters grouped by section
 */
import { Link } from "expo-router";
import { View, Pressable, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { Chapter } from "../utils/contentLoader";
import { useApp } from "@/contexts/AppContext";
import { Colors, spacing } from "@/constants/theme";

// Group chapters by section
function groupChaptersBySection(chapters: Chapter[]) {
  const sections: Record<string, { title: string; chapters: Chapter[] }> = {
    kitzur_orach_chaim: { title: 'קיצור שולחן ערוך - אורח חיים', chapters: [] },
    orach_chaim: { title: 'אורח חיים', chapters: [] },
    yoreh_deah: { title: 'יורה דעה', chapters: [] },
    even_haezer: { title: 'אבן העזר', chapters: [] },
    choshen_mishpat: { title: 'חושן משפט', chapters: [] },
  };

  chapters.forEach(ch => {
    if (ch.id.startsWith('kitzur_orach_chaim')) {
      sections.kitzur_orach_chaim.chapters.push(ch);
    } else if (ch.id.startsWith('orach_chaim')) {
      sections.orach_chaim.chapters.push(ch);
    } else if (ch.id.startsWith('yoreh_deah')) {
      sections.yoreh_deah.chapters.push(ch);
    } else if (ch.id.startsWith('even_haezer')) {
      sections.even_haezer.chapters.push(ch);
    } else if (ch.id.startsWith('choshen_mishpat')) {
      sections.choshen_mishpat.chapters.push(ch);
    }
  });

  return Object.entries(sections).filter(([_, data]) => data.chapters.length > 0);
}

export default function ChapterList({ chapters }: { chapters: Chapter[] }) {
  const { getTextSizeMultiplier } = useApp();
  const textMultiplier = getTextSizeMultiplier();
  const groupedSections = groupChaptersBySection(chapters);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {groupedSections.map(([sectionKey, sectionData]) => (
        <View key={sectionKey} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>{sectionData.title}</ThemedText>
            <ThemedText style={styles.sectionCount}>
              {sectionData.chapters.length} סימנים
            </ThemedText>
          </View>
          <View style={styles.listContainer}>
            {sectionData.chapters.map((ch, index) => (
              <Link key={ch.id} href={`/chapter/${ch.id}`} asChild>
                <Pressable 
                  style={({ pressed }) => [
                    styles.chapterCard,
                    pressed && styles.pressed
                  ]}
                >
                  <View style={styles.cardContent}>
                    <ThemedText 
                      style={[styles.chapterLabel, { fontSize: 16 * textMultiplier }]}
                    >
                      {ch.chapterLabel}
                    </ThemedText>
                    <ThemedText 
                      style={[styles.chapterTitle, { fontSize: 15 * textMultiplier }]}
                      numberOfLines={2}
                    >
                      {ch.title}
                    </ThemedText>
                    <ThemedText style={styles.seifCount}>
                      {ch.sections.length} סעיפים
                    </ThemedText>
                  </View>
                  <View style={styles.chevron}>
                    <ThemedText style={styles.chevronText}>›</ThemedText>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      ))}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.base,
  },
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    backgroundColor: Colors.light.primary.dark,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  sectionCount: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  listContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border.default,
  },
  pressed: {
    opacity: 0.5,
    backgroundColor: Colors.light.background.base,
  },
  cardContent: {
    flex: 1,
  },
  chapterLabel: {
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 4,
    color: Colors.light.primary.main,
    fontSize: 17,
  },
  chapterTitle: {
    textAlign: 'right',
    marginBottom: 0,
    lineHeight: 21,
    color: Colors.light.text.secondary,
    fontSize: 15,
  },
  seifCount: {
    fontSize: 13,
    textAlign: 'right',
    opacity: 0.5,
    color: Colors.light.text.secondary,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 20,
    opacity: 0.3,
    color: Colors.light.secondary.main,
  },
  spacer: {
    height: 40,
  },
});

