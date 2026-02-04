import React from 'react';
import { ScrollView, StyleSheet, View, Linking, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { SymbolViewProps } from 'expo-symbols';

export default function AboutScreen() {
  const appVersion = '1.2.0';
  
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
            למען שמו באהבה
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            קיצור שולחן ערוך • ברכות • פרשת השבוע
          </ThemedText>
          <ThemedText style={styles.version}>גרסה {appVersion}</ThemedText>
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📖 אודות האפליקציה
          </ThemedText>
          <ThemedText style={styles.text}>
            "למען שמו באהבה" - אפליקציית לימוד תורה מקיפה המשלבת את קיצור שולחן ערוך המלא, ברכות ותפילות מעוצבות, ותכונות ייחודיות ללימוד יומיומי.
          </ThemedText>
          <ThemedText style={styles.text}>
            האפליקציה מציגה בכל יום את פרשת השבוע הנוכחית והלכה יומית מסונכרנת עם קהילת הלומדים בכל העולם, מה שמאפשר לכל אחד ללמוד את אותו סימן באותו יום.
          </ThemedText>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ✨ תכונות עיקריות
          </ThemedText>
          <FeatureItem icon="book.fill" text="קיצור שולחן ערוך המלא - 221 סימנים" />
          <FeatureItem icon="calendar" text="פרשת השבוע - מתעדכנת אוטומטית" />
          <FeatureItem icon="sparkles" text="הלכה יומית - סינכרון עולמי יומיומי" />
          <FeatureItem icon="magnifyingglass" text="חיפוש מתקדם בכל התוכן" />
          <FeatureItem icon="bookmark.fill" text="סימניות אישיות ללימוד" />
          <FeatureItem icon="chart.bar.fill" text="מעקב התקדמות - 221 סימנים" />
          <FeatureItem icon="flame.fill" text="רצף לימוד יומי - מוטיבציה להתמדה" />
          <FeatureItem icon="moon.stars.fill" text="ברכות מעוצבות: ברכת המזון, מעין שלוש, בורא נפשות" />
          <FeatureItem icon="scroll.fill" text="תכנים נוספים: אגרת הרמב״ן, פרשת המן, שניים מקרא" />
          <FeatureItem icon="arrow.uturn.forward" text="חזרה למקום הקריאה האחרון" />
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🎯 איך זה עובד
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>הלכה יומית מסונכרנת:</ThemedText> כל יום מוצגת הלכה שונה מתוך 221 הסימנים, מחושבת לפי מספר הימים מאז תחילת הלימוד העולמי. כך כל הלומדים בעולם לומדים את אותו סימן באותו יום.
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>פרשת השבוע:</ThemedText> מוצגת בראש המסך הראשי ומתעדכנת אוטומטית בכל שבוע.
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>המשך לימוד:</ThemedText> האפליקציה זוכרת את המיקום האחרון שבו קראת ומאפשרת לחזור אליו במהירות.
          </ThemedText>
        </View>

        {/* Content Sources */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📚 מקורות התוכן
          </ThemedText>
          <ThemedText style={styles.text}>
            הטקסטים באפליקציה מבוססים על מקורות מהימנים:
          </ThemedText>
          <ThemedText style={styles.bulletText}>• קיצור שולחן ערוך - נוסח ספרד</ThemedText>
          <ThemedText style={styles.bulletText}>• ברכות ותפילות - נוסח עדות המזרח</ThemedText>
          <ThemedText style={styles.bulletText}>• תוכן נוסף מספריית ספריא ומקורות נוספים</ThemedText>
        </View>

        {/* Technical Info */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🔧 מידע טכני
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>פלטפורמה:</ThemedText> React Native + Expo
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>גרסת האפליקציה:</ThemedText> {appVersion}
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>עדכון אחרון:</ThemedText> פברואר 2026
          </ThemedText>
        </View>

        {/* What's New */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🆕 מה חדש בגרסה {appVersion}
          </ThemedText>
          <ThemedText style={styles.bulletText}>✅ אייקון חדש של מנורה זהב</ThemedText>
          <ThemedText style={styles.bulletText}>✅ תצוגת פרשת השבוע בדף הבית</ThemedText>
          <ThemedText style={styles.bulletText}>✅ הלכה יומית מסונכרנת עולמית (במקום רנדומלי)</ThemedText>
          <ThemedText style={styles.bulletText}>✅ כל הטקסטים באנגלית הומרו לעברית</ThemedText>
          <ThemedText style={styles.bulletText}>✅ שיפור ניווט - כפתור חזרה בכל המסכים</ThemedText>
          <ThemedText style={styles.bulletText}>✅ חץ "המשך לימוד" מוקטן ומושלם</ThemedText>
        </View>

        {/* Previous Updates */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📝 עדכונים קודמים
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>גרסה 1.1.0:</ThemedText>
          </ThemedText>
          <ThemedText style={styles.bulletText}>• עיצוב מחדש של ברכות ותפילות</ThemedText>
          <ThemedText style={styles.bulletText}>• הפרדת הנחיות דיאלוג (המברך אומר, המסובים עונים)</ThemedText>
          <ThemedText style={styles.bulletText}>• הנחיות אופציונליות בכחול (בשבת, בחג)</ThemedText>
          <ThemedText style={styles.bulletText}>• מסך טעינה מעוצב עם שם האפליקציה</ThemedText>
          <ThemedText style={styles.bulletText}></ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>גרסה 1.0.0:</ThemedText>
          </ThemedText>
          <ThemedText style={styles.bulletText}>• שחרור ראשוני</ThemedText>
          <ThemedText style={styles.bulletText}>• קיצור שולחן ערוך המלא</ThemedText>
          <ThemedText style={styles.bulletText}>• מערכת חיפוש וסימניות</ThemedText>
          <ThemedText style={styles.bulletText}>• מעקב התקדמות ורצפים</ThemedText>
        </View>

        {/* Developer Info */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            👨‍💻 פיתוח
          </ThemedText>
          <ThemedText style={styles.text}>
            פותח במטרה להנגיש את לימוד ההלכה ולאפשר למידה נוחה ומעקב אחר התקדמות.
          </ThemedText>
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

interface FeatureItemProps {
  icon: SymbolViewProps['name'];
  text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <IconSymbol size={20} name={icon} color={Colors.light.primary.main} />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </View>
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
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  version: {
    marginTop: 5,
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 25,
    backgroundColor: Colors.light.background.surface,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
    marginLeft: 5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border.default,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 5,
  },
});
