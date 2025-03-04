import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeHeader: React.FC = () => {
  const { currentScheme } = useContext(ThemeContext);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.username);
        }
      } catch (error) {
        console.log('Kullanıcı verisi alınamadı', error);
      }
    };

    fetchUser();
  }, []);

  const currentHour = new Date().getHours();
  let greeting = '';
  if (currentHour >= 6 && currentHour < 12) greeting = 'Günaydın';
  else if (currentHour >= 12 && currentHour < 16) greeting = 'İyi Öğlenler';
  else if (currentHour >= 16 && currentHour < 23) greeting = 'İyi Akşamlar';
  else greeting = 'İyi Geceler';

  if (username) {
    greeting = `${greeting}, ${username}`;
  }

  const today = new Date();
  const day = today.getDate();
  const month = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(today);
  const weekday = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(today);
  const formattedDate = `${day} ${month}, ${weekday}`;

  const dynamicStyles = {
    headerText: {
      color: currentScheme === 'dark' ? '#fff' : '#333',
    },
    dateText: {
      color: currentScheme === 'dark' ? '#ccc' : '#666',
    },
  };

  return (
    <View style={styles.header}>
      <Text style={[styles.greeting, dynamicStyles.headerText]}>{greeting}</Text>
      <Text style={[styles.date, dynamicStyles.dateText]}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    padding: 16, 
    paddingTop: 60, 
  },
  greeting: { 
    fontSize: 24, 
    fontWeight: '600',
  },
  date: { 
    fontSize: 14, 
    opacity: 0.7, 
    marginTop: 4,
  },
});

export default HomeHeader;
