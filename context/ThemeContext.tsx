import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextProps {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  currentScheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'system',
  setTheme: () => {},
  currentScheme: 'light',
});

const THEME_STORAGE_KEY = '@theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [currentScheme, setCurrentScheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() || 'light');

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          const parsedTheme = storedTheme as ThemeMode;
          setThemeState(parsedTheme);
          if (parsedTheme !== 'system') {
            setCurrentScheme(parsedTheme);
          } else {
            setCurrentScheme(Appearance.getColorScheme() || 'light');
          }
        }
      } catch (error) {
        console.log('Tema yükleme hatası:', error);
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeMode) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Tema kaydetme hatası:', error);
    }
    if (newTheme !== 'system') {
      setCurrentScheme(newTheme);
    } else {
      setCurrentScheme(Appearance.getColorScheme() || 'light');
    }
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system' && colorScheme) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCurrentScheme(colorScheme);
      }
    });
    return () => subscription.remove();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
