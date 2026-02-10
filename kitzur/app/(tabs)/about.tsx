import React from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';

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
          {/* Modern Hebrew Letter Icon */}
          <LinearGradient
            colors={['#4A90E2', '#B394E8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <ThemedText style={styles.hebrewLetterIcon}>ב</ThemedText>
          </LinearGradient>
          <ThemedText type="title" style={styles.appTitle}>
            בראשית
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            לפי מרן ופוסקי עדות המזרח
          </ThemedText>
          <ThemedText style={styles.version}>גרסה {appVersion}</ThemedText>
        </View>

        {/* Sephardic Badge */}
        <View style={styles.sephardicBadge}>
          <ThemedText style={styles.badgeText}>
            אפליקציה ספרדית
          </ThemedText>
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📖 אודות
          </ThemedText>
          <ThemedText style={styles.text}>
            אפליקציית הלכה מקיפה <ThemedText style={styles.bold}>לקהל ספרדי ועדות המזרח</ThemedText>, בנויה להנגיש לימוד הלכה למעשה בצורה נוחה ופשוטה.
          </ThemedText>
          <ThemedText style={[styles.text, styles.highlight]}>
            ✨ לפי מרן השולחן ערוך - לא רמא
          </ThemedText>
          <ThemedText style={styles.text}>
            היא כוללת:
          </ThemedText>
          <ThemedText style={styles.bulletText}>• 2,008 סימנים - קיצור ושולחן ערוך מלא</ThemedText>
          <ThemedText style={styles.bulletText}>• הלכה יומית (מחזור 221 יום)</ThemedText>
          <ThemedText style={styles.bulletText}>• שאלות ותשובות קהילתיות</ThemedText>
          <ThemedText style={styles.bulletText}>• ברכות ותפילות - נוסח עדות המזרח</ThemedText>
          <ThemedText style={styles.bulletText}>• חיפוש מתקדם ומעקב התקדמות</ThemedText>
          <ThemedText style={styles.bulletText}>• פרשת השבוע - שניים מקרא ואחד תרגום</ThemedText>
        </View>

        {/* Sephardic Poskim */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            👨‍🏫 פוסקים ספרדיים
          </ThemedText>
          <ThemedText style={styles.text}>
            האפליקציה מבוססת על פסיקת:
          </ThemedText>
          <ThemedText style={styles.bulletText}>• <ThemedText style={styles.bold}>מרן השולחן ערוך</ThemedText> זצ&quot;ל - הפוסק הספרדי הגדול</ThemedText>
          <ThemedText style={styles.bulletText}>• <ThemedText style={styles.bold}>הרב עובדיה יוסף</ThemedText> זצוק&quot;ל - מרן פוסק הדור</ThemedText>
          <ThemedText style={styles.bulletText}>• <ThemedText style={styles.bold}>הרב יצחק יוסף</ThemedText> שליט&quot;א - הראשון לציון</ThemedText>
          <ThemedText style={styles.bulletText}>• ילקוט יוסף - הלכה פשוטה</ThemedText>
          <ThemedText style={styles.bulletText}>• יביע אומר - שו&quot;ת</ThemedText>
          <ThemedText style={styles.bulletText}>• הליכות עולם</ThemedText>
        </View>

        {/* Sources */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📚 מקורות הלכתיים
          </ThemedText>
          <ThemedText style={styles.text}>
            כל התכנים מבוססים על מקורות מהימנים:
          </ThemedText>
          <ThemedText style={styles.bulletText}>• <ThemedText style={styles.bold}>שולחן ערוך מרן</ThemedText> - ארבעה טורים מלאים</ThemedText>
          <ThemedText style={styles.bulletText}>• <ThemedText style={styles.bold}>קיצור שולחן ערוך</ThemedText> - נוסח ספרד</ThemedText>
          <ThemedText style={styles.bulletText}>• <ThemedText style={styles.bold}>ברכות ותפילות</ThemedText> - נוסח עדות המזרח</ThemedText>
          <ThemedText style={styles.bulletText}>• תוכן נוסף מספריית ספריא ומקורות נוספים</ThemedText>
          <ThemedText style={[styles.text, styles.highlight, { marginTop: 8 }]}>
            ⭐ כל ההלכות לפי פסיקת מרן - ללא רמ&quot;א
          </ThemedText>
        </View>

        {/* Q&A Sephardic Policy */}
        <View style={[styles.section, styles.criticalSection]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, styles.criticalTitle]}>
            🔴 חשוב ביותר - שאלות ותשובות
          </ThemedText>
          <View style={styles.warningBox}>
            <ThemedText style={[styles.text, styles.warningText, styles.bold]}>
              ⚠️ כל שאלה ותשובה באפליקציה זו חייבת להיות על פי פסיקה ספרדית בלבד!
            </ThemedText>
            <ThemedText style={[styles.text, styles.warningText, { marginTop: 8 }]}>
              • רק פסיקת מרן והפוסקים הספרדיים
            </ThemedText>
            <ThemedText style={[styles.text, styles.warningText]}>
              • אין להשיב על פי פסיקה אשכנזית
            </ThemedText>
            <ThemedText style={[styles.text, styles.warningText]}>
              • כל תשובה חייבת לציין מקורות ספרדיים
            </ThemedText>
            <ThemedText style={[styles.text, styles.warningText, { marginTop: 8, fontWeight: 'bold' }]}>
              90% מהקהל שלנו הם ספרדים - נכבד את זה!
            </ThemedText>
          </View>
        </View>


        {/* What's New */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🆕 מה חדש בגרסה {appVersion}
          </ThemedText>
          <ThemedText style={styles.bulletText}>✅ עיצוב ספרדי/מזרחי חדש (צבעים חמים)</ThemedText>
          <ThemedText style={styles.bulletText}>✅ מיקוד ברור לקהל ספרדי ועדות המזרח</ThemedText>
          <ThemedText style={styles.bulletText}>✅ הדגשת פוסקים ספרדיים</ThemedText>
          <ThemedText style={styles.bulletText}>• עיצוב מחדש של ברכות ותפילות</ThemedText>
          <ThemedText style={styles.bulletText}>• מעקב התקדמות משופר</ThemedText>
        </View>


        {/* Disclaimer */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            ⚠️ הערה חשובה
          </ThemedText>
          <ThemedText style={styles.text}>
            אפליקציה זו מיועדת ללימוד ועיון בלבד על פי פסיקה ספרדית. למעשה הלכה יש להתייעץ עם רב ספרדי מוסמך.
          </ThemedText>
          <ThemedText style={[styles.text, styles.highlight, { marginTop: 8 }]}>
            כל התכנים והתשובות בנויים על פסיקת מרן ועדות המזרח
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
            ב תורה לשמה לזכות כל עם ישראל ועדות המזרח
          </ThemedText>
          <ThemedText style={styles.footerText}>
            © 2026 בראשית
          </ThemedText>
          <ThemedText style={[styles.footerText, { marginTop: 8, fontSize: 12 }]}>
            בנוי על ידי ספרדים, לספרדים 💚
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
    marginBottom: 20,
    marginTop: 40,
    paddingTop: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  hebrewLetterIcon: {
    fontSize: 72,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'System',
    textAlign: 'center',
    letterSpacing: -2,
  },
  hebrewIcon: {
    fontSize: 64,
    marginBottom: 15,
    marginTop: 10,
  },
  appTitle: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: Colors.light.secondary.main,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
  version: {
    fontSize: 16,
    color: Colors.light.primary.main,
    marginTop: 5,
  },
  sephardicBadge: {
    backgroundColor: Colors.light.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  criticalSection: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.secondary.main,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.primary.main,
    textAlign: 'right',
  },
  criticalTitle: {
    color: '#D84315',
    fontSize: 22,
  },
  warningBox: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EF5350',
  },
  warningText: {
    color: '#C62828',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'right',
    lineHeight: 24,
  },
  highlight: {
    color: Colors.light.secondary.main,
    fontWeight: '600',
    fontSize: 17,
  },
  bold: {
    fontWeight: 'bold',
    color: Colors.light.primary.main,
  },
  bulletText: {
    fontSize: 16,
    marginRight: 12,
    marginBottom: 4,
    textAlign: 'right',
    lineHeight: 24,
  },
  link: {
    color: Colors.light.primary.main,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border.default,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 4,
  },
});