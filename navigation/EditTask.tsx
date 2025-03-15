import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TodoContext, Todo, AlarmSettings } from '../context/TodoContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

type EditTaskRouteProp = RouteProp<{ EditTask: { todo: Todo } }, 'EditTask'>;

const EditTaskScreen: React.FC = () => {
  const { params: { todo } } = useRoute<EditTaskRouteProp>();
  const { editTodo } = useContext(TodoContext);
  const navigation = useNavigation();

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [date, setDate] = useState(new Date(todo.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmSound, setAlarmSound] = useState('Default Samsung');
  const [snoozeCount, setSnoozeCount] = useState(3);

  useEffect(() => {
    const loadAlarmSettings = async () => {
      const stored = await AsyncStorage.getItem(`alarm_${todo.id}`);
      if (stored) {
        const alarm: AlarmSettings = JSON.parse(stored);
        setAlarmEnabled(alarm.enabled);
        setAlarmSound(alarm.alarmSound || 'Default Samsung');
        setSnoozeCount(alarm.snoozeCount);
      }
    };
    loadAlarmSettings();
  }, [todo.id]);

  const pickAlarmSound = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (!result.canceled) {
      setAlarmSound(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Görev adı boş olamaz.');
      return;
    }

    if (date < new Date()) {
      Alert.alert('Hata', 'Geçmiş tarih ve saat seçilemez.');
      return;
    }

    const alarmSettings: AlarmSettings = alarmEnabled
      ? { enabled: true, alarmSound, snoozeCount }
      : { enabled: false };

    try {
      await editTodo({
        id: todo.id,
        user_id: todo.user_id,
        title,
        description,
        date,
        is_completed: todo.is_completed,
        alarmSettings,
      });

      await AsyncStorage.setItem(
        `alarm_${todo.id}`,
        JSON.stringify(alarmSettings)
      );

      Alert.alert('Başarılı', 'Görev başarıyla güncellendi.');
      navigation.goBack();
    } catch {
      Alert.alert('Hata', 'Görev güncellenirken hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Görev Adı:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Görev adı"
      />

      <Text style={styles.label}>Açıklama:</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Açıklama"
        multiline
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>Tarih & Saat: {date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
              setShowTimePicker(true);
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime)
              setDate(
                prev =>
                  new Date(
                    prev.setHours(selectedTime.getHours(), selectedTime.getMinutes())
                  )
              );
          }}
        />
      )}

      <View style={styles.alarmToggle}>
        <Switch value={alarmEnabled} onValueChange={setAlarmEnabled} />
        <Text style={styles.alarmToggleText}>Alarm'ı Etkinleştir</Text>
      </View>

      {alarmEnabled && (
        <>
          <TouchableOpacity onPress={pickAlarmSound}>
            <Text style={styles.alarmText}>Alarm Sesi: {alarmSound}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Ertelenme Sayısı:</Text>
          <TextInput
            style={styles.input}
            value={String(snoozeCount)}
            onChangeText={text => setSnoozeCount(Number(text))}
            keyboardType="numeric"
            placeholder="Kaç kez ertelensin?"
          />
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateText: {
    marginVertical: 16,
    fontSize: 16,
  },
  alarmToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  alarmToggleText: {
    fontSize: 16,
    marginLeft: 8,
  },
  alarmText: {
    fontSize: 16,
    marginVertical: 8,
    color: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditTaskScreen;
