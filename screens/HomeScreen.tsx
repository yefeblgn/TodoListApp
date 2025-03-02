import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { ThemeContext } from '../context/ThemeContext';
import HomeHeader from '../components/HomeHeader';
import TodoList from '../components/TodoList';
import { getDynamicStyles } from '../utils/themeCheck';

const HomeScreen: React.FC = () => {
  const { todos, toggleTodo } = useContext(TodoContext);
  const { currentScheme } = useContext(ThemeContext);

  const dynamicStyles = getDynamicStyles(currentScheme);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <HomeHeader />
      <TodoList 
        todos={todos} 
        onToggle={toggleTodo} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
});

export default HomeScreen;
