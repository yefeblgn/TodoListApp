import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
}

interface TodoContextProps {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  editTodo: (updatedTodo: Todo) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  addTodo: () => {},
  editTodo: () => {},
  toggleTodo: () => {},
  deleteTodo: () => {},
});

const TODOS_STORAGE_KEY = '@todos';

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Uygulama açıldığında AsyncStorage'dan todo'ları yükle
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
        if (storedTodos) {
          const parsedTodos: Todo[] = JSON.parse(storedTodos).map((t: any) => ({
            ...t,
            date: new Date(t.date),
          }));
          setTodos(parsedTodos);
        }
      } catch (error) {
        console.log('Todo yükleme hatası:', error);
      }
    };
    loadTodos();
  }, []);

  // todos state'i değiştiğinde AsyncStorage'a kaydet
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.log('Todo kaydetme hatası:', error);
      }
    };
    saveTodos();
  }, [todos]);
  const scheduleNotification = async (todo: Todo) => {
    const now = new Date();
    if (todo.date > now) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Görev Zamanı Geldi',
            body: todo.title,
            sound: 'default',
          },
          trigger: todo.date,
        });
      } catch (error) {
        console.log('Bildirim planlama hatası:', error);
      }
    }
  };

  const addTodo = (todo: Todo) => {
    setTodos(prev => [...prev, todo]);
    scheduleNotification(todo);
  };

  const editTodo = (updatedTodo: Todo) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
    scheduleNotification(updatedTodo);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, editTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};
