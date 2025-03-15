import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { TodoAPI } from '../utils/process';

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  due_date?: string | null;
  is_completed: boolean;
}

interface TodoContextProps {
  todos: Todo[];
  loadTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'is_completed'>) => Promise<void>;
  editTodo: (updatedTodo: Todo) => Promise<void>;
  toggleTodo: (id: number, currentStatus: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  loadTodos: async () => {},
  addTodo: async () => {},
  editTodo: async () => {},
  toggleTodo: async () => {},
  deleteTodo: async () => {},
});

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await TodoAPI.listTodos(user.id);

      if (response.success) {
        const loadedTodos: Todo[] = response.todos.map((t: any) => ({
          ...t,
          due_date: t.due_date ? new Date(t.due_date).toISOString() : null,
          is_completed: t.is_completed === 1,
        }));
        setTodos(loadedTodos);
        loadedTodos.forEach(scheduleNotification);
      } else {
        console.error('❌ Todo yükleme hatası:', response.error);
      }
    } catch (error) {
      console.error('❌ Todo yükleme sırasında hata oluştu:', error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const scheduleNotification = async (todo: Todo) => {
    if (!todo.due_date) return;

    const now = new Date();
    const dueDate = new Date(todo.due_date);
    if (dueDate > now) {
      const totalDuration = dueDate.getTime() - now.getTime();
      const notificationTime = new Date(now.getTime() + totalDuration * 0.9);

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Görev Süreniz Dolmak Üzere!',
            body: `${todo.title} görevinin tamamlanmasına son %10 süre kaldı!`,
            sound: 'default',
          },
          trigger: notificationTime,
        });
      } catch (error) {
        console.error('❌ Bildirim planlama hatası:', error);
      }
    }
  };

  const addTodo = async (newTodo: Omit<Todo, 'id' | 'is_completed'>) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await TodoAPI.addTodo({
        user_id: user.id,
        title: newTodo.title,
        description: newTodo.description,
        due_date: newTodo.due_date ? new Date(newTodo.due_date).toISOString() : null,
      });

      if (response.success) {
        const addedTodo: Todo = {
          id: response.todo_id,
          user_id: user.id,
          title: newTodo.title,
          description: newTodo.description,
          due_date: newTodo.due_date,
          is_completed: false,
        };
        setTodos((prev) => [...prev, addedTodo]);
        scheduleNotification(addedTodo);
      } else {
        console.error('❌ Todo ekleme hatası:', response.error);
      }
    } catch (error) {
      console.error('❌ Todo ekleme sırasında hata oluştu:', error);
    }
  };

  const editTodo = async (updatedTodo: Todo) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await TodoAPI.editTodo({
        id: updatedTodo.id,
        user_id: user.id,
        title: updatedTodo.title || '',
        description: updatedTodo.description || '',
        due_date: updatedTodo.due_date ? new Date(updatedTodo.due_date).toISOString() : null,
        is_completed: updatedTodo.is_completed ? 1 : 0,
      });

      if (response.success) {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
        scheduleNotification(updatedTodo);
      } else {
        console.error('❌ Todo düzenleme hatası:', response.error);
      }
    } catch (error) {
      console.error('❌ Todo düzenleme sırasında hata oluştu:', error);
    }
  };

  const toggleTodo = async (id: number, currentStatus: boolean) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const newStatus = currentStatus ? 0 : 1;

      const response = await TodoAPI.editTodo({
        id,
        user_id: user.id,
        is_completed: newStatus,
      });

      if (response.success) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
          )
        );
      } else {
        console.error('❌ Todo toggle hatası:', response.error);
      }
    } catch (error) {
      console.error('❌ Todo toggle hatası:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const response = await TodoAPI.deleteTodo(id, user.id);

      if (response.success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } else {
        console.error('❌ Todo silme hatası:', response.error);
      }
    } catch (error) {
      console.error('❌ Todo silme sırasında hata oluştu:', error);
    }
  };

  return (
    <TodoContext.Provider value={{ todos, loadTodos, addTodo, editTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
