import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TodoContext, Todo } from '../context/TodoContext';
import TodoItemCard from '../components/TodoItemCard';
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen: React.FC = () => {
  const { todos, toggleTodo } = useContext(TodoContext);
  const { currentScheme } = useContext(ThemeContext);

  const currentHour = new Date().getHours();
  let greeting = '';
  if (currentHour >= 6 && currentHour < 12) greeting = 'Günaydın';
  else if (currentHour >= 12 && currentHour < 16) greeting = 'İyi Öğlenler';
  else if (currentHour >= 16 && currentHour < 23) greeting = 'İyi Akşamlar';
  else greeting = 'İyi Geceler';

 const today = new Date();
  const day = today.getDate();
  const month = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(today);
  const weekday = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(today);
  const formattedDate = `${day} ${month}, ${weekday}`;


  const sortedTodos = [...todos].sort((a: Todo, b: Todo) => a.date.getTime() - b.date.getTime());


  const dynamicStyles = {
    container: {
      backgroundColor: currentScheme === 'dark' ? '#222' : '#F2F2F2',
    },
    headerText: {
      color: currentScheme === 'dark' ? '#fff' : '#333',
    },
    dateText: {
      color: currentScheme === 'dark' ? '#ccc' : '#666',
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, dynamicStyles.headerText]}>{greeting}</Text>
        <Text style={[styles.date, dynamicStyles.dateText]}>{formattedDate}</Text>
      </View>
      <FlatList
        data={sortedTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItemCard 
            todo={item} 
            onToggle={toggleTodo} 
            onEdit={() => {}} 
            onDelete={() => {}} 
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    padding: 16, 
    paddingTop: 60, 
  },
  greeting: { 
    fontSize: 24, 
    fontWeight: '600',
  },
  date: { 
    fontSize: 14, 
    opacity: 0.7, 
    marginTop: 4,
  },
});

export default HomeScreen;
