import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { UserAPI } from '../utils/process';

const HistoryScreen = () => {
  const { user } = useContext(UserContext);
  const { currentScheme } = useContext(ThemeContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await UserAPI.getUserHistory(user!.id);
      if (response.success) {
        setHistory(response.history);
      } else {
        console.log('Geçmiş yükleme hatası:', response.error);
      }
    } catch (error) {
      console.log('Geçmiş yüklenirken hata oluştu:', error);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentScheme === 'dark' ? '#222' : '#fff' }]}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : history.length === 0 ? (
        <Text style={[styles.noHistory, { color: currentScheme === 'dark' ? '#ccc' : '#333' }]}>
          Henüz tamamlanmış bir göreviniz yok.
        </Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.task}>
              <Text style={[styles.taskTitle, { color: currentScheme === 'dark' ? '#fff' : '#333' }]}>
                {item.title}
              </Text>
              <Text style={[styles.taskDate, { color: currentScheme === 'dark' ? '#ccc' : '#888' }]}>
                {item.date ? new Date(item.date).toLocaleString() : 'Tarih belirtilmedi'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  task: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: 13,
    marginTop: 4,
  },
  noHistory: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HistoryScreen;
