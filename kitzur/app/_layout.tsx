import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';

// ...existing code...
import { AppProvider } from '@/contexts/AppContext';
import { Colors } from '@/constants/theme';

// Enable RTL for Hebrew support
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export const unstable_settings = {
  anchor: 'חזרה',
};

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.dir = 'rtl';
    }
  }, []);

  return (
    <AppProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.light.primary.main,
            },
            headerTintColor: Colors.light.text.onPrimary,
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerBackTitle: 'חזור',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'חזור' }} />
          <Stack.Screen 
            name="browse" 
            options={{ 
              title: 'כל הסימנים',
            }} 
          />
          <Stack.Screen 
            name="bookmarks" 
            options={{ 
              title: 'סימניות שמורות',
            }} 
          />
          <Stack.Screen 
            name="chapter/[id]" 
            options={{ 
              title: 'סימן',
            }} 
          />
          <Stack.Screen 
            name="section/[id]" 
            options={{ 
              title: 'סעיף',
            }} 
          />
          <Stack.Screen 
            name="parsha/[id]" 
            options={{ 
              title: 'פרשת השבוע',
            }} 
          />
          <Stack.Screen 
            name="shnayim-mikra" 
            options={{ 
              title: 'שניים מקרא ואחד תרגום',
            }} 
          />
          <Stack.Screen 
            name="parshat-hamann" 
            options={{ 
              title: 'פרשת המן',
            }} 
          />
          <Stack.Screen 
            name="iggeret-haramban" 
            options={{ 
              title: 'אגרת הרמב״ן',
            }} 
          />
          <Stack.Screen 
            name="birkat-hamazon" 
            options={{ 
              title: 'ברכת המזון',
            }} 
          />
          <Stack.Screen 
            name="meein-shalosh" 
            options={{ 
              title: 'מעיין שלוש',
            }} 
          />
          <Stack.Screen 
            name="borei-nefashot" 
            options={{ 
              title: 'בורא נפשות',
            }} 
          />
          <Stack.Screen 
            name="questions" 
            options={{ 
              title: 'שאלות ותשובות',
            }} 
          />
          <Stack.Screen
            name="question/[id]"
            options={{
              title: 'שאלה',
            }}
          />
          <Stack.Screen
            name="ask-question"
            options={{
              title: 'שאלה חדשה',
            }}
          />
          <Stack.Screen
            name="answer-question"
            options={{
              title: 'מענה לשאלה',
            }}
          />
          <Stack.Screen
            name="pending-answers"
            options={{
              title: 'תשובות ממתינות',
            }}
          />
          <Stack.Screen
            name="add-section"
            options={{
              title: 'הוספת סעיף',
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              title: 'חיפוש',
            }}
          />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal', 
              title: 'הגדרות',
              headerStyle: {
                backgroundColor: Colors.light.primary.main,
              },
              headerTintColor: Colors.light.text.onPrimary,
            }} 
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AppProvider>
  );
}
