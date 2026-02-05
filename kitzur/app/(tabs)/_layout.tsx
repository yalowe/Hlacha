import { Tabs as טאבים } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
// ...existing code...

export default function פריסתטאבים() {
  // ...existing code...

  return (
    <טאבים
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary.main,
        tabBarInactiveTintColor: Colors.light.text.secondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.light.background.surface,
          borderTopColor: Colors.light.border.default,
        },
      }}>
      <טאבים.Screen
        name="index"
        options={{
          title: 'קיצור',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
      <טאבים.Screen
        name="explore"
        options={{
          title: 'הגדרות',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </טאבים>
  );
}
