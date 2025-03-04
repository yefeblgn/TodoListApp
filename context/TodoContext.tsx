import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: Date;
  is_completed: boolean;
}

interface TodoContextProps {
  todos: Todo[];
  loadTodos: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id' | 'is_completed'>) => Promise<void>;
  editTodo: (updatedTodo: Todo) => Promise<void>;
  toggleTodo: (id: string, currentStatus: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const TodoContext = createContext<TodoContextProps>({
  todos: [],
  loadTodos: async () => {},
  addTodo: async () => {},
  editTodo: async () => {},
  toggleTodo: async () => {},
  deleteTodo: async () => {},
});

const API_BASE = 'https://api.owouwu.com/api/';

const getUserId = async (): Promise<string | null> => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      console.log("Retrieved user from AsyncStorage:", user);
      return user.id || null;
    } else {
      console.log("No user data found in AsyncStorage");
    }
  } catch (error) {
    console.log("Kullanıcı verisi alınamadı", error);
  }
  return null;
};

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.log('Kullanıcı ID bulunamadı.');
        return;
      }
      const response = await fetch(API_BASE + 'list-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const loadedTodos: Todo[] = data.todos.map((t: any) => ({
          ...t,
          due_date: t.due_date ? new Date(t.due_date) : undefined,
        }));
        setTodos(loadedTodos);
      } else {
        console.log('List Todo API error: ', data.error);
      }
    } catch (error) {
      console.log('Todo yükleme hatası:', error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const scheduleNotification = async (todo: Todo) => {
    const now = new Date();
    if (todo.due_date && todo.due_date > now) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Görev Zamanı Geldi',
            body: todo.title,
            sound: 'default',
          },
          trigger: todo.due_date,
        });
      } catch (error) {
        console.log('Bildirim planlama hatası:', error);
      }
    }
  };

  const addTodo = async (newTodo: Omit<Todo, 'id' | 'is_completed'>) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.log('Kullanıcı ID bulunamadı, todo eklenemedi.');
        return;
      }
      const dueDate = new Date();
      const response = await fetch(API_BASE + 'add-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          title: newTodo.title,
          description: newTodo.description,
          date: dueDate.toISOString(),
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const addedTodo: Todo = {
          id: data.todo_id.toString(),
          user_id: userId,
          title: newTodo.title,
          description: newTodo.description,
          due_date: dueDate,
          is_completed: false,
        };
        setTodos(prev => [...prev, addedTodo]);
        scheduleNotification(addedTodo);
      }
    } catch (error) {
      console.log('Todo ekleme hatası:', error);
    }
  };

  const editTodo = async (updatedTodo: Todo) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.log('Kullanıcı ID bulunamadı, todo düzenlenemedi.');
        return;
      }
      const response = await fetch(API_BASE + 'edit-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedTodo.id,
          user_id: userId,
          title: updatedTodo.title,
          description: updatedTodo.description,
          is_completed: updatedTodo.is_completed,
          date: updatedTodo.due_date ? updatedTodo.due_date.toISOString() : null,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        );
        scheduleNotification(updatedTodo);
      }
    } catch (error) {
      console.log('Todo düzenleme hatası:', error);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.log('Kullanıcı ID bulunamadı, todo toggle yapılamadı.');
        return;
      }
      const response = await fetch(API_BASE + 'edit-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          user_id: userId,
          is_completed: !currentStatus,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo
          )
        );
      }
    } catch (error) {
      console.log('Todo toggle hatası:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(API_BASE + 'delete-todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.log('Todo silme hatası:', error);
    }
  };

  return (
    <TodoContext.Provider value={{ todos, loadTodos, addTodo, editTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
