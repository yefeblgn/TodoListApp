import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Linking,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext, ThemeMode } from '../context/ThemeContext';
import { getDynamicStyles } from '../utils/themeCheck';
import styles from '../styles/SettingsStyles';

const API_BASE = 'https://api.owouwu.com/api/';

const SettingsContent: React.FC = () => {
  const { theme, setTheme, currentScheme } = useContext(ThemeContext);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const navigation = useNavigation();
  const dynamicStyles = getDynamicStyles(currentScheme);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserEmail(user.email);
        }
      } catch (error) {
        console.log('Kullanıcı verisi alınamadı', error);
      }
    };
    getUserData();
  }, []);

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };
  

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hesabı Sil",
      "Hesabını gerçekten silmek istiyor musun?",
      [
        { text: "Hayır", style: "cancel" },
        {
          text: "Evet",
          onPress: () => {
            setPasswordInput('');
            setDeleteModalVisible(true);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteAccount = async () => {
    if (!passwordInput.trim()) {
      Alert.alert("Hata", "Lütfen şifrenizi giriniz.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_BASE + 'delete-account', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password: passwordInput }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.ok && data.success) {
        await AsyncStorage.removeItem('user');
        setDeleteModalVisible(false);
        navigation.navigate('Auth');
      } else {
        Alert.alert("Hata", data.error || "Hesap silinemedi.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Hata", "Bağlantı hatası.");
    }
  };

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

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Hesap İşlemleri
        </Text>
        <TouchableOpacity 
          style={styles.otherSettings}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={[styles.accountButton, styles.otherSettingsText, dynamicStyles.otherSettingsText]}>
            Hesaptan Çıkış Yap
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.otherSettings}
          onPress={handleDeleteAccount}
          activeOpacity={0.8}
        >
          <Text style={[styles.accountButtonText, { color: '#FF3B30' }, styles.otherSettingsText]}>
            Hesabı Sil
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
        Diğer Ayarlar
      </Text>
      <TouchableOpacity
        style={styles.otherSettings}
        onPress={openAppSettings}
        activeOpacity={0.8}
      >
        <Text style={[styles.otherSettingsText, dynamicStyles.otherSettingsText]}>
          Uygulama Ayarları
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, dynamicStyles.footerText]}>
          Todo List Uygulaması by yefeblgn
        </Text>
      </View>

      <Modal
        transparent
        animationType="slide"
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>
              Hesabını silmek için şifrenizi giriniz
            </Text>
            <TextInput
              placeholder="Şifre"
              secureTextEntry
              style={modalStyles.modalInput}
              value={passwordInput}
              onChangeText={setPasswordInput}
            />
            {loading ? (
              <ActivityIndicator color="#FF3B30" style={{ marginVertical: 10 }} />
            ) : (
              <TouchableOpacity style={modalStyles.modalButton} onPress={confirmDeleteAccount}>
                <Text style={modalStyles.modalButtonText}>Hesabı Sil</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(false)}
              style={modalStyles.modalCancelButton}
            >
              <Text style={modalStyles.modalCancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  modalButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
    width: '100%',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default SettingsContent;
