import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user, updateUser } = useContext(UserContext);
  const { currentScheme } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setProfilePicture(user.profile_picture);
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(username, password || undefined, profilePicture);
      Alert.alert('Başarılı', 'Profil güncellendi.');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenemedi.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: currentScheme === 'dark' ? '#fff' : '#333' }]}>Profil</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../assets/settings.png')} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require('../assets/profile.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <View style={styles.usernameContainer}>
        <Text style={[styles.usernameText, { color: currentScheme === 'dark' ? '#fff' : '#333' }]}>
          {username}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/edit.png')} style={styles.editIcon} />
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: currentScheme === 'dark' ? '#333' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: currentScheme === 'dark' ? '#fff' : '#333' }]}>
              Kullanıcı Adını Güncelle
            </Text>
            <TextInput
              style={styles.modalInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Yeni Kullanıcı Adı"
              placeholderTextColor={currentScheme === 'dark' ? '#aaa' : '#666'}
            />
            <TouchableOpacity onPress={handleUpdate} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Güncelle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={[styles.taskInfo, { color: currentScheme === 'dark' ? '#fff' : '#333' }]}>
        Toplam görev: {user?.total_tasks || 0}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.historyButton}>
        <Image source={require('../assets/history.png')} style={styles.historyIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  settingsIcon: {
    width: 28,
    height: 28,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 20,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editIcon: {
    width: 24,
    height: 24,
    tintColor: '#007AFF',
  },
  taskInfo: {
    fontSize: 16,
    marginTop: 20,
  },
  historyButton: {
    marginTop: 30,
  },
  historyIcon: {
    width: 50,
    height: 50,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalClose: {
    marginTop: 10,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default ProfileScreen;
