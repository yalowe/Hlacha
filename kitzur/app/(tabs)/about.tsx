import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AboutScreen() {
  const appVersion = '1.1.0';

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* App Header */}
        <View style={styles.header}>
          <IconSymbol size={80} name="book.fill" color={Colors.light.primary.main} />
          <ThemedText type="title" style={styles.appTitle}>
            אודות האפליקציה
          </ThemedText>
          <ThemedText style={styles.version}>גרסה {appVersion}</ThemedText>
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📖 אודות האפליקציה
          </ThemedText>
          <ThemedText style={styles.text}>
            האפליקציה נועדה להנגיש לימוד וחקר מקורות יהודיים בצורה נוחה, ידידותית ומותאמת לעברית (RTL).
          </ThemedText>
          <ThemedText style={styles.text}>
            היא כוללת בין היתר:
          </ThemedText>
          <ThemedText style={styles.bulletText}>• לימוד תנ״ך ומקורות</ThemedText>
          <ThemedText style={styles.bulletText}>• הלכות (כולל הלכה יומית - מחזור פרטי של סעיף אחד ליום)</ThemedText>
          <ThemedText style={styles.bulletText}>• שולחן ערוך / קיצור שולחן ערוך</ThemedText>
          <ThemedText style={styles.bulletText}>• שאילת שאלות וקבלת מענה</ThemedText>
          <ThemedText style={styles.bulletText}>• מנגנון משוב על תשובות (אהבתי/לא אהבתי)</ThemedText>
          <ThemedText style={styles.bulletText}>• חיפוש מתקדם בתכנים</ThemedText>
          <ThemedText style={styles.bulletText}>• מעקב התקדמות לימודית</ThemedText>
          <ThemedText style={styles.text}>
            המטרה היא לאפשר לכל משתמש ללמוד, לשאול, ולהעמיק – בצורה פשוטה, מסודרת ונגישה.
          </ThemedText>
        </View>

        {/* Sources */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📚 מקורות
          </ThemedText>
          <ThemedText style={styles.text}>
            הטקסטים באפליקציה מבוססים על מקורות מהימנים:
          </ThemedText>
          <ThemedText style={styles.bulletText}>• קיצור שולחן ערוך - נוסח ספרד</ThemedText>
          <ThemedText style={styles.bulletText}>• ברכות ותפילות - נוסח עדות המזרח</ThemedText>
          <ThemedText style={styles.bulletText}>• תוכן נוסף מספריית ספריא ומקורות נוספים</ThemedText>
        </View>


        {/* What's New */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🆕 מה חדש בגרסה {appVersion}
          </ThemedText>
          <ThemedText style={styles.bulletText}>✅ עיצוב מחדש של ברכות ותפילות</ThemedText>
          <ThemedText style={styles.bulletText}>✅ הדגשה ברורה של ברכות וסעיפים</ThemedText>
          <ThemedText style={styles.bulletText}>• מעקב התקדמות ורצפים</ThemedText>
        </View>


        {/* Disclaimer */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ⚠️ הערה חשובה
          </ThemedText>
          <ThemedText style={styles.text}>
            אפליקציה זו מיועדת ללימוד ועיון בלבד. למעשה הלכה יש להתייעץ עם רב מוסמך.
          </ThemedText>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            💝 תמיכה
          </ThemedText>
          <ThemedText style={styles.text}>
            נהנית מהאפליקציה? שתף אותה עם חברים ומשפחה!
          </ThemedText>
          <ThemedText style={styles.text}>
            לשאלות, הערות או תרומה: 
            <ThemedText style={styles.link} onPress={() => openLink('mailto:support@kitzur-app.org')}>support@kitzur-app.org</ThemedText>
          </ThemedText>
        </View>

        {/* Previous Updates */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📝 עדכונים קודמים
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>גרסה 1.0.0:</ThemedText>
          </ThemedText>
          <ThemedText style={styles.bulletText}>• שחרור ראשוני</ThemedText>
          <ThemedText style={styles.bulletText}>• קיצור שולחן ערוך המלא</ThemedText>
          <ThemedText style={styles.bulletText}>• מערכת חיפוש וסימניות שמורות</ThemedText>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            תורה לשמה לזכות כל עם ישראל
          </ThemedText>
          <ThemedText style={styles.footerText}>
            © 2026 קיצור שולחן ערוך אפליקציה
          </ThemedText>
        </View>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  appTitle: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    color: Colors.light.primary.main,
    marginTop: 5,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.primary.main,
    textAlign: 'right',
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 16,
    marginRight: 12,
    marginBottom: 2,
    textAlign: 'right',
  },
  link: {
    color: Colors.light.primary.main,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});