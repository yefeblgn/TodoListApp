import React, { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Animated, Image } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { ThemeContext } from '../context/ThemeContext';
import HomeHeader from '../components/HomeHeader';
import TodoItemCard from '../components/TodoItemCard';
import { getDynamicStyles } from '../utils/themeCheck';

const HomeScreen: React.FC = () => {
  const { todos, toggleTodo, editTodo, deleteTodo, loadTodos } = useContext(TodoContext);
  const { currentScheme } = useContext(ThemeContext);
  const dynamicStyles = getDynamicStyles(currentScheme);
  const [refreshing, setRefreshing] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;

  const startSpin = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    startSpin();
    await loadTodos();
    setRefreshing(false);
  }, [loadTodos, spinValue]);

  const handleEdit = (todo: any) => {
    editTodo(todo);
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderItem = ({ item }: { item: any }) => (
    <TodoItemCard
      todo={item}
      onToggle={toggleTodo}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<HomeHeader />}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={['transparent']}
          />
        }
      />
      {refreshing && (
        <Animated.View style={[styles.refreshIconContainer, { transform: [{ rotate: spin }] }]}>
         
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  refreshIconContainer: {
    position: 'absolute',
    paddingTop  : 10,
    top: 10,
    alignSelf: 'center',
    zIndex: 10,
  },
  refreshIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default HomeScreen;
