import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TodoContext, Todo } from '../context/TodoContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';

type ParamList = {
  EditTask: { todo: Todo };
};

const EditTaskScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, 'EditTask'>>();
  const { todo } = route.params;
  const { editTodo } = useContext(TodoContext);
  const navigation = useNavigation();
  const { currentScheme } = useContext(ThemeContext);

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [date, setDate] = useState(todo.date);
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
            (selectedTime.getHours() === now.getHours() && selectedTime.getMinutes() < now.getMinutes()))
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

  const handleSave = () => {
    const now = new Date();
    if (date < now) {
      Alert.alert('Hata', 'Geçmiş tarih ve saat seçilemez.');
      return;
    }
    editTodo({ ...todo, title, description, date });
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
    saveButton: { backgroundColor: '#007AFF' },
    saveButtonText: { color: '#fff' },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.header, dynamicStyles.header]}>Görev Düzenle</Text>

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

      <TouchableOpacity style={[styles.saveButton, dynamicStyles.saveButton]} onPress={handleSave}>
        <Text style={[styles.saveButtonText, dynamicStyles.saveButtonText]}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTaskScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 60,
  },
  header: { 
    fontSize: 24, 
    fontWeight: '600', 
    marginBottom: 24,
  },
  label: { 
    fontSize: 16, 
    marginVertical: 8,
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16, 
  },
  datePicker: { 
    marginVertical: 16, 
    padding: 12, 
    borderWidth: 1, 
    borderRadius: 8, 
    borderColor: '#ddd',
  },
  dateText: { 
    fontSize: 16,
  },
  saveButton: { 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 24, 
  },
  saveButtonText: { 
    fontSize: 16,
  },
});
