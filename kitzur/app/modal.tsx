import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, spacing } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">הגדרות</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">חזרה למסך הבית</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: Colors.light.background.base,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
