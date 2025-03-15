import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TodoContext } from '../context/TodoContext';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

const AddTaskScreen = () => {
  const { addTodo } = useContext(TodoContext);
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmSound, setAlarmSound] = useState('Default Samsung');
  const [snoozeCount, setSnoozeCount] = useState(3);

  const pickAlarmSound = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (!result.canceled) {
      setAlarmSound(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Görev adı boş olamaz.');
      return;
    }
    if (date < new Date()) {
      Alert.alert('Hata', 'Geçmiş tarih ve saat seçilemez.');
      return;
    }

    const alarmSettings = alarmEnabled
      ? { enabled: true, alarmSound, snoozeCount }
      : { enabled: false };

    try {
      await addTodo({ title, description, date, alarmSettings });
      await AsyncStorage.setItem('alarm_' + title, JSON.stringify(alarmSettings));
      navigation.goBack();
    } catch {
      Alert.alert('Hata', 'Görev eklenirken hata oluştu.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput value={title} onChangeText={setTitle} placeholder="Görev adı" />
      <TextInput value={description} onChangeText={setDescription} placeholder="Açıklama" multiline />

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text>Tarih & Saat: {date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          minimumDate={new Date()}
          onChange={(e, selected) => {
            setShowDatePicker(false);
            if (selected) {
              setDate(selected);
              setShowTimePicker(true);
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          onChange={(e, selected) => {
            setShowTimePicker(false);
            if (selected) setDate(prev => new Date(prev.setHours(selected.getHours(), selected.getMinutes())));
          }}
        />
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
        <Switch value={alarmEnabled} onValueChange={setAlarmEnabled} />
        <Text>Alarm'ı etkinleştir</Text>
      </View>

      {alarmEnabled && (
        <>
          <TouchableOpacity onPress={pickAlarmSound}>
            <Text>Alarm Sesi: {alarmSound}</Text>
          </TouchableOpacity>

          <TextInput
            value={String(snoozeCount)}
            onChangeText={(text) => setSnoozeCount(Number(text))}
            keyboardType="numeric"
            placeholder="Ertelenme sayısı"
          />
        </>
      )}

      <TouchableOpacity onPress={handleAdd}>
        <Text>Görevi Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTaskScreen;
