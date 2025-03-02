import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ThemeContext, ThemeMode } from '../context/ThemeContext';
import { getDynamicStyles } from '../utils/themeCheck';
import styles from '../styles/SettingsStyles';

const SettingsContent: React.FC = () => {
  const { theme, setTheme, currentScheme } = useContext(ThemeContext);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  const handleNotificationsToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        setIsNotificationsEnabled(true);
      } else {
        setIsNotificationsEnabled(false);
      }
    } else {
      setIsNotificationsEnabled(false);
    }
  };

  const openAppSettings = () => {
    Linking.openSettings().catch(() => {});
  };

  const dynamicStyles = getDynamicStyles(currentScheme);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.header, dynamicStyles.header]}>Ayarlar</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Uygulama Teması
        </Text>
        <View style={styles.options}>
          {(['light', 'dark', 'system'] as const).map(option => (
            <TouchableOpacity
              key={option}
              onPress={() => handleThemeChange(option)}
              style={[
                styles.option,
                dynamicStyles.option,
                theme === option && styles.selectedOption,
              ]}
              activeOpacity={0.8}
            >
              <Text 
                style={[
                  styles.optionText,
                  dynamicStyles.optionText,
                  theme === option && { color: '#fff' },
                ]}
              >
                {option === 'light'
                  ? 'Açık'
                  : option === 'dark'
                  ? 'Koyu'
                  : 'Sistem Teması'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Bildirim Ayarı
        </Text>
        <View style={styles.optionRow}>
          <Text style={[styles.optionText, dynamicStyles.optionText]}>
            Bildirimleri Aç
          </Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
            thumbColor={'#fff'}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.otherSettings}
        onPress={openAppSettings}
        activeOpacity={0.8}
      >
        <Text style={[styles.otherSettingsText, dynamicStyles.otherSettingsText]}>
          Diğer Ayarlar
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, dynamicStyles.footerText]}>
          Todo List Uygulaması by yefeblgn
        </Text>
      </View>
    </View>
  );
};

export default SettingsContent;
