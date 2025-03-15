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
import { TodoAPI } from '../utils/process';

export type Todo = {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string | null;
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
      if (!userData) return;

      const user = JSON.parse(userData);
      console.log('🔵 Kullanıcı bilgileri alındı:', user);

      const response = await TodoAPI.listTodos(user.id);
      console.log('🔵 API Yanıtı:', response);

      if (response.success) {
        const loadedTodos: Todo[] = response.todos.map((t: any) => ({
          ...t,
          due_date: t.due_date ? new Date(t.due_date).toISOString() : null,
        }));
        setTodos(loadedTodos);
      } else {
        console.error('❌ List Todo API error:', response.error);
      }
    } catch (error) {
      console.error('❌ Fetch todos error:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleEdit = (todo: Todo) => {
    navigation.navigate('EditTaskScreen', { todo });
  };

  const handleDelete = async (id: number) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;
      const user = JSON.parse(userData);

      console.log('🔴 Todo siliniyor:', id);

      const response = await TodoAPI.deleteTodo(id, user.id);
      console.log('🔴 API Yanıtı:', response);

      if (response.success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } else {
        console.error('❌ Delete todo error:', response.error);
      }
    } catch (error) {
      console.error('❌ Delete todo exception:', error);
    }
  };

  const handleToggle = async (id: number, is_completed: boolean) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;
      const user = JSON.parse(userData);

      console.log('🟠 Todo durumu değiştiriliyor:', { id, is_completed: !is_completed });

      const response = await TodoAPI.editTodo({
        id,
        user_id: user.id,
        is_completed: !is_completed,
      });

      console.log('🟠 API Yanıtı:', response);

      if (response.success) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
          )
        );
      } else {
        console.error('❌ Toggle todo error:', response.error);
      }
    } catch (error) {
      console.error('❌ Toggle todo exception:', error);
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.due_date || !b.due_date) return 0;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.header, dynamicStyles.header]}>Yapılacaklar Listesi</Text>
      <FlatList
        data={sortedTodos}
        keyExtractor={(item) => item.id.toString()}
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
