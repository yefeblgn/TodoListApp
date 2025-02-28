import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TodoContext, Todo } from '../context/TodoContext';
import TodoItemCard from '../components/TodoItemCard';
import { TasksStackParamList } from '../App';
import { ThemeContext } from '../context/ThemeContext';

type TasksScreenNavigationProp = NativeStackNavigationProp<
  TasksStackParamList,
  'TasksScreen'
>;

const TasksScreen: React.FC = () => {
  const { todos, deleteTodo, toggleTodo } = useContext(TodoContext);
  const navigation = useNavigation<TasksScreenNavigationProp>();
  const { currentScheme } = useContext(ThemeContext);

  const sortedTodos = [...todos].sort((a: Todo, b: Todo) => a.date.getTime() - b.date.getTime());

  const handleEdit = (todo: Todo) => {
    navigation.navigate('EditTaskScreen', { todo });
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const dynamicStyles = {
    container: {
      backgroundColor: currentScheme === 'dark' ? '#222' : '#F2F2F2',
    },
    header: {
      color: currentScheme === 'dark' ? '#fff' : '#333',
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.header, dynamicStyles.header]}>Yapılacaklar Listesi</Text>
      <FlatList
        data={sortedTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItemCard
            todo={item}
            onToggle={toggleTodo}
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    paddingHorizontal: 16, 
    fontWeight: '600',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 120,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: { 
    width: 30, 
    height: 30, 
    tintColor: '#fff' 
  },
});

export default TasksScreen;
