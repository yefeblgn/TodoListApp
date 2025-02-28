import React, { useContext } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Todo } from '../context/TodoContext';
import { ThemeContext } from '../context/ThemeContext';

interface TodoItemCardProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onToggle: (id: string) => void;
}

const ACTION_WIDTH = 75;

const TodoItemCard: React.FC<TodoItemCardProps> = ({ todo, onDelete, onEdit, onToggle }) => {
  const { currentScheme } = useContext(ThemeContext);
  const now = new Date();
  const isOverdue = now >= todo.date;
  const renderLeftActions = (progress: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation) => {
    const scale = dragX.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const translateX = dragX.interpolate({
      inputRange: [0, 50],
      outputRange: [-10, 0],
      extrapolate: 'clamp',
    });
    return (
      !isOverdue && (
        <TouchableOpacity onPress={() => onEdit(todo)} activeOpacity={0.8}>
          <Animated.View style={[styles.actionContainer, { backgroundColor: '#007AFF', width: ACTION_WIDTH }]}>
            <Animated.Image
              source={require('../assets/edit.png')}
              style={[styles.actionIcon, { transform: [{ scale }, { translateX }] }]}
            />
          </Animated.View>
        </TouchableOpacity>
      )
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation) => {
    const scale = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const translateX = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [0, 10],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={() => onDelete(todo.id)} activeOpacity={0.8}>
        <Animated.View style={[styles.actionContainer, { backgroundColor: '#FF3B30', width: ACTION_WIDTH }]}>
          <Animated.Image
            source={require('../assets/trash.png')}
            style={[styles.actionIcon, { transform: [{ scale }, { translateX }] }]}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={() => { if (!isOverdue) onEdit(todo); }}
      onSwipeableRightOpen={() => onDelete(todo.id)}
      containerStyle={styles.swipeContainer}
      childrenContainerStyle={styles.childrenContainer}
    >
      <TouchableOpacity
        onPress={() => !isOverdue && onToggle(todo.id)}
        activeOpacity={0.8}
        disabled={isOverdue}>
        <View style={[styles.card, currentScheme === 'dark' && styles.cardDark]}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, currentScheme === 'dark' && styles.titleDark, todo.completed && styles.completed]}>
              {todo.title}
            </Text>
            <Text style={[styles.date, currentScheme === 'dark' && styles.dateDark]}>
              {todo.date.toLocaleString()}
            </Text>
          </View>
          {}
          <View style={styles.statusIndicator}>
            {isOverdue ? (
              <Image source={require('../assets/red_x.png')} style={styles.statusIcon} />
            ) : todo.completed ? (
              <Image source={require('../assets/tick.png')} style={styles.statusIcon} />
            ) : (
              <View style={styles.emptyIndicator} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default TodoItemCard;

const styles = StyleSheet.create({
  swipeContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  childrenContainer: {},
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#333',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  titleDark: {
    color: '#fff',
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  dateDark: {
    color: '#ccc',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 8,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emptyIndicator: {
    width: 20,
    height: 20,
  },
  statusIcon: {
    width: 20,
    height: 20,
  },
});
