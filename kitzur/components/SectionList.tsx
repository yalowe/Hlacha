/**
 * SectionList Component
 * Displays a list of sections for a chapter
 */
import { Link } from "expo-router";
import { View, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { Chapter } from "../utils/contentLoader";
import { useApp } from "@/contexts/AppContext";
import { Colors, spacing } from "@/constants/theme";
import { toHebrewNumeral } from "@/utils/hebrewNumbers";

export default function SectionList({ chapter }: { chapter: Chapter }) {
  const { getTextSizeMultiplier } = useApp();
  const textMultiplier = getTextSizeMultiplier();

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {chapter.sections.map(sec => (
          <Link key={sec.id} href={`/section/${sec.id}`} asChild>
            <Pressable 
              style={({ pressed }) => [
                styles.sectionCard,
                pressed && styles.pressed
              ]}
            >
              <View style={styles.cardContent}>
                <ThemedText 
                  style={[styles.sectionNumber, { fontSize: 15 * textMultiplier }]}
                >
                  סעיף {toHebrewNumeral(sec.section)}
                </ThemedText>
                <ThemedText 
                  style={[styles.sectionPreview, { fontSize: 14 * textMultiplier }]} 
                  numberOfLines={2}
                >
                  {sec.text}
                </ThemedText>
              </View>
              <View style={styles.chevron}>
                <ThemedText style={styles.chevronText}>›</ThemedText>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background.base,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  sectionCard: {
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
  sectionNumber: {
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 6,
    color: Colors.light.primary.main,
    fontSize: 16,
  },
  sectionPreview: {
    textAlign: 'right',
    opacity: 0.7,
    lineHeight: 21,
    color: Colors.light.text.secondary,
    fontSize: 15,
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

