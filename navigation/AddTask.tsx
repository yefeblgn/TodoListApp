import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TodoContext } from '../context/TodoContext';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';

const AddTaskScreen: React.FC = () => {
  const { addTodo } = useContext(TodoContext);
  const { currentScheme } = useContext(ThemeContext);
  const navigation = useNavigation();

  const initialDate = new Date(new Date().getTime() + 3600000);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        const now = new Date();
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          Alert.alert('Hata', 'Geçmiş tarih seçilemez.');
          return;
        }
        setDate(prev => {
          const newDate = new Date(selectedDate);
          newDate.setHours(prev.getHours(), prev.getMinutes());
          return newDate;
        });
      }
      setShowTimePicker(true);
    } else {
      if (selectedDate) setDate(selectedDate);
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (selectedTime) {
        const now = new Date();
        if (
          date.toDateString() === now.toDateString() &&
          (selectedTime.getHours() < now.getHours() ||
            (selectedTime.getHours() === now.getHours() &&
              selectedTime.getMinutes() < now.getMinutes()))
        ) {
          Alert.alert('Hata', 'Geçmiş saat seçilemez.');
          return;
        }
        setDate(prev => {
          const newDate = new Date(prev);
          newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
          return newDate;
        });
      }
    } else {
      if (selectedTime) setDate(selectedTime);
    }
  };

  const handleAdd = async () => {
    if (title.trim() === '') {
      Alert.alert('Hata', 'Görev adı boş olamaz.');
      return;
    }
    const now = new Date();
    if (date < now) {
      Alert.alert('Hata', 'Geçmiş tarih ve saat seçilemez.');
      return;
    }
    await addTodo({ title, description, due_date: date });
    navigation.goBack();
  };

  const dynamicStyles = {
    container: { backgroundColor: currentScheme === 'dark' ? '#222' : '#fff' },
    header: { color: currentScheme === 'dark' ? '#fff' : '#333' },
    label: { color: currentScheme === 'dark' ? '#fff' : '#333' },
    input: {
      borderColor: currentScheme === 'dark' ? '#555' : '#ddd',
      color: currentScheme === 'dark' ? '#fff' : '#333',
    },
    dateText: { color: currentScheme === 'dark' ? '#fff' : '#333' },
    addButton: { backgroundColor: '#007AFF' },
    addButtonText: { color: '#fff' },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.header, dynamicStyles.header]}>Görev Ekle</Text>
      <Text style={[styles.label, dynamicStyles.label]}>Görev Adı</Text>
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        value={title}
        onChangeText={setTitle}
        placeholder="Görev adını girin"
        placeholderTextColor={currentScheme === 'dark' ? '#aaa' : '#888'}
      />
      <Text style={[styles.label, dynamicStyles.label]}>Açıklama (İsteğe bağlı)</Text>
      <TextInput
        style={[styles.input, { height: 80 }, dynamicStyles.input]}
        value={description}
        onChangeText={setDescription}
        placeholder="Görev açıklaması"
        multiline
        placeholderTextColor={currentScheme === 'dark' ? '#aaa' : '#888'}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text style={[styles.dateText, dynamicStyles.dateText]}>
          Tarih & Saat: {date.toLocaleString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}
      {Platform.OS === 'ios' && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDate(selectedDate);
          }}
          minimumDate={new Date()}
        />
      )}
      <TouchableOpacity style={[styles.addButton, dynamicStyles.addButton]} onPress={handleAdd}>
        <Text style={[styles.addButtonText, dynamicStyles.addButtonText]}>Görevi Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60 },
  header: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
  label: { fontSize: 16, marginVertical: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  datePicker: { marginVertical: 16, padding: 12, borderWidth: 1, borderRadius: 8, borderColor: '#ddd' },
  dateText: { fontSize: 16 },
  addButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  addButtonText: { fontSize: 16 },
});
