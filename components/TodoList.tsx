import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TodoItemCard from './TodoItemCard';
import { Todo } from './TasksContent';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onEdit, onDelete }) => {
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const renderItem = ({ item }: { item: Todo }) => (
    <TodoItemCard 
      todo={item} 
      onToggle={() => onToggle(item.id)} 
      onEdit={() => onEdit(item)} 
      onDelete={() => onDelete(item.id)} 
    />
  );

  return (
    <View style={styles.listContainer}>
      <FlatList 
        data={sortedTodos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
});

export default TodoList;
