import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { I18nManager } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '@/contexts/AppContext';
import { Colors } from '@/constants/theme';

// Enable RTL for Hebrew support
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="browse" 
            options={{ 
              title: 'כל הסימנים',
              headerBackTitle: 'חזרה',
            }} 
          />
          <Stack.Screen 
            name="bookmarks" 
            options={{ 
              title: 'סימניות',
              headerBackTitle: 'חזרה',
            }} 
          />
          <Stack.Screen 
            name="chapter/[id]" 
            options={{ 
              title: 'סימן',
              headerBackTitle: 'חזרה',
            }} 
          />
          <Stack.Screen 
            name="section/[id]" 
            options={{ 
              title: 'סעיף',
              headerBackTitle: 'חזרה',
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
