import React, { useContext } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TodoContext, Todo } from '../context/TodoContext';
import TodoItemCard from './TodoItemCard';
import { TasksStackParamList } from '../App';
import { ThemeContext } from '../context/ThemeContext';
import { getDynamicStyles } from '../utils/themeCheck';
import styles from '../styles/TasksStyles';

type TasksScreenNavigationProp = NativeStackNavigationProp<
  TasksStackParamList,
  'TasksScreen'
>;

const TasksContent: React.FC = () => {
  const { todos, deleteTodo, toggleTodo } = useContext(TodoContext);
  const { currentScheme } = useContext(ThemeContext);
  const navigation = useNavigation<TasksScreenNavigationProp>();

  const sortedTodos = [...todos].sort(
    (a: Todo, b: Todo) => a.due_date.getTime() - b.due_date.getTime()
  );

  const handleEdit = (todo: Todo) => {
    navigation.navigate('EditTaskScreen', { todo });
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleToggle = (id: string) => {
    const todoItem = todos.find(todo => todo.id === id);
    if (todoItem) {
      toggleTodo(todoItem.id, todoItem.is_completed);
    }
  };

  const dynamicStyles = getDynamicStyles(currentScheme);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.header, dynamicStyles.header]}>
        Yapılacaklar Listesi
      </Text>
      <FlatList
        data={sortedTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItemCard
            todo={item}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
