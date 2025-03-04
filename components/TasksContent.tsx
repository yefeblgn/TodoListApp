import React, { useContext, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TodoItemCard from './TodoItemCard';
import { TasksStackParamList } from '../App';
import { ThemeContext } from '../context/ThemeContext';
import { getDynamicStyles } from '../utils/themeCheck';
import styles from '../styles/TasksStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://api.owouwu.com/api/';

export type Todo = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_completed: boolean;
  date: Date;
};

type TasksScreenNavigationProp = NativeStackNavigationProp<
  TasksStackParamList,
  'TasksScreen'
>;

const TasksContent: React.FC = () => {
  const { currentScheme } = useContext(ThemeContext);
  const navigation = useNavigation<TasksScreenNavigationProp>();
  const dynamicStyles = getDynamicStyles(currentScheme);
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const response = await fetch(API_BASE + 'list-todo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          const loadedTodos: Todo[] = data.todos.map((t: any) => ({
            ...t,
            date: t.date ? new Date(t.date) : new Date(),
          }));
          setTodos(loadedTodos);
        } else {
          console.log('List Todo API error: ', data.error);
        }
      }
    } catch (error) {
      console.log('Fetch todos error:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleEdit = (todo: Todo) => {
    navigation.navigate('EditTaskScreen', { todo });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(API_BASE + 'delete-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } else {
        console.log('Delete todo error: ', data.error);
      }
    } catch (error) {
      console.log('Delete todo exception:', error);
    }
  };

  const handleToggle = async (id: string, is_completed: boolean) => {
    try {
      const response = await fetch(API_BASE + 'edit-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_completed: !is_completed }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
          )
        );
      } else {
        console.log('Toggle todo error: ', data.error);
      }
    } catch (error) {
      console.log('Toggle todo exception:', error);
    }
  };

  const sortedTodos = [...todos].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.header, dynamicStyles.header]}>Yapılacaklar Listesi</Text>
      <FlatList
        data={sortedTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItemCard
            todo={item}
            onToggle={() => handleToggle(item.id, item.is_completed)}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTaskScreen')}
        activeOpacity={0.8}
      >
        <Image source={require('../assets/add.png')} style={styles.fabIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default TasksContent;
