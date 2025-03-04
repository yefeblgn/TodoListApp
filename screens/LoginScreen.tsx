import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import AuthForm from '../components/AuthForm';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthParamList } from '../navigation/AuthParamList';
import { TodoContext } from '../context/TodoContext';

type AuthScreenNavigationProp = StackNavigationProp<AuthParamList, 'Auth'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { loadTodos } = useContext(TodoContext);

  const handleAuthSuccess = async () => {
    await loadTodos();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e9eff5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
});

export default LoginScreen;
