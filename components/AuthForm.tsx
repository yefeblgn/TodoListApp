import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://api.owouwu.com/api/';

const AuthForm: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const validateEmail = (email: string): boolean => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const handleAuth = async () => {
    if (isSignUp) {
      if (!username.trim()) {
        Alert.alert('Hata', 'Kullanıcı adı boş olamaz.');
        return;
      }
      if (username.trim().length < 3 || username.trim().length > 16) {
        Alert.alert('Hata', 'Kullanıcı adı 3 ile 16 karakter arasında olmalıdır.');
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert('Hata', 'Geçerli bir e-posta adresi giriniz.');
        return;
      }
      if (password.length < 8 || password.length > 64) {
        Alert.alert('Hata', 'Şifre 8 ile 64 karakter arasında olmalıdır.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Hata', 'Şifreler eşleşmiyor.');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(API_BASE + 'newuser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        setLoading(false);
        if (response.ok && data.success) {
          const userData = {
            id: data.user_id,
            username,
            email,
          };
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          onAuthSuccess();
        } else {
          Alert.alert('Hata', data.error || 'Kayıt yapılamadı');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Hata', 'Bağlantı hatası');
      }
    } else {
      if (!validateEmail(email)) {
        Alert.alert('Hata', 'Geçerli bir e-posta adresi giriniz.');
        return;
      }
      if (password.length < 8 || password.length > 64) {
        Alert.alert('Hata', 'Şifre 8 ile 64 karakter arasında olmalıdır.');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(API_BASE + 'userlogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        setLoading(false);
        if (response.ok && data.success) {
          const userData = {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
          };
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          onAuthSuccess();
        } else {
          Alert.alert('Hata', data.error || 'Giriş yapılamadı');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Hata', 'Bağlantı hatası');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <View style={styles.formContainer}>
          {isSignUp && (
            <TextInput
              placeholder="Kullanıcı Adı"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
            />
          )}
          <TextInput
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setPasswordVisible(prev => !prev)}
            >
              <Image
                source={
                  passwordVisible
                    ? require('../assets/eye-on.png')
                    : require('../assets/eye-off.png')
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          {isSignUp && (
            <TextInput
              placeholder="Şifreyi Onayla"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!passwordVisible}
              style={styles.input}
            />
          )}
          <TouchableOpacity onPress={handleAuth} style={styles.button}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.toggleContainer}
          >
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'Zaten hesabın var mı? Giriş Yap'
                : 'Hesabın yok mu? Kayıt Ol'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9eff5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
  input: {
    width: '100%',
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  passwordWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#007BFF',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  toggleText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default AuthForm;
