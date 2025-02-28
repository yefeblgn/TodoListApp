import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  Linking 
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { ThemeContext, ThemeMode } from '../context/ThemeContext';

const SettingsScreen: React.FC = () => {
  const { theme, setTheme, currentScheme } = useContext(ThemeContext);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);

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

  const dynamicStyles = {
    container: {
      backgroundColor: currentScheme === 'dark' ? '#222' : '#fff',
    },
    header: {
      color: currentScheme === 'dark' ? '#fff' : '#333',
    },
    sectionTitle: {
      color: currentScheme === 'dark' ? '#fff' : '#333',
    },
    optionText: {
      color: currentScheme === 'dark' ? '#fff' : '#333',
    },
    otherSettingsText: {
      color: currentScheme === 'dark' ? '#fff' : '#007AFF',
    },
    footerText: {
      color: currentScheme === 'dark' ? '#aaa' : '#888',
    },
    option: {
      borderColor: currentScheme === 'dark' ? '#555' : '#ddd',
      backgroundColor: currentScheme === 'dark' ? '#444' : 'transparent',
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.header, dynamicStyles.header]}>Ayarlar</Text>

     
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Uygulama Teması</Text>
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
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Bildirim Ayarı</Text>
        <View style={styles.optionRow}>
          <Text style={[styles.optionText, dynamicStyles.optionText]}>Bildirimleri Aç</Text>
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

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 60,
  },
  header: { 
    fontSize: 24, 
    fontWeight: '600', 
    marginVertical: 16, 
  },
  section: { 
    marginVertical: 12, 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '500', 
    marginBottom: 8, 
  },
  options: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: { 
    backgroundColor: '#007AFF', 
    borderColor: '#007AFF' 
  },
  optionText: { 
    fontSize: 16, 
  },
  optionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  otherSettings: { 
    marginTop: 16, 
    padding: 12, 
    borderWidth: 1, 
    borderRadius: 8, 
    alignItems: 'center', 
  },
  otherSettingsText: { 
    fontSize: 16, 
  },
  footer: { 
    position: 'absolute', 
    bottom: 20, 
    width: '100%', 
    alignItems: 'center', 
  },
  footerText: { 
    fontSize: 14, 
  },
});
