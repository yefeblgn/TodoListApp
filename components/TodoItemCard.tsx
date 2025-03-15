import React, { useContext } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Todo, TodoContext } from '../context/TodoContext';
import { ThemeContext } from '../context/ThemeContext';

interface TodoItemCardProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
}

const ACTION_WIDTH = 80;

const TodoItemCard: React.FC<TodoItemCardProps> = ({ todo, onDelete, onEdit }) => {
  const { currentScheme } = useContext(ThemeContext);
  const { toggleTodo } = useContext(TodoContext);

  const now = new Date();
  const isOverdue = todo.due_date ? new Date(todo.due_date) < now : false;
  const formattedDate = todo.due_date ? new Date(todo.due_date).toLocaleString() : 'Tarih belirtilmedi';

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      !isOverdue && (
        <TouchableOpacity onPress={() => onEdit(todo)} activeOpacity={0.8}>
          <Animated.View
            style={[styles.actionContainer, { backgroundColor: '#007AFF', width: ACTION_WIDTH }]}
          >
            <Animated.Image
              source={require('../assets/edit.png')}
              style={[styles.actionIcon, { transform: [{ scale }] }]}
            />
          </Animated.View>
        </TouchableOpacity>
      )
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-50, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={() => onDelete(todo.id)} activeOpacity={0.8}>
        <Animated.View style={[styles.actionContainer, { backgroundColor: '#FF3B30', width: ACTION_WIDTH }]}>
          <Animated.Image
            source={require('../assets/trash.png')}
            style={[styles.actionIcon, { transform: [{ scale }] }]}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
      <TouchableOpacity
        onPress={() => {
          if (!isOverdue && todo.id !== undefined) {
            toggleTodo(todo.id, !todo.is_completed);
          }
        }}
        activeOpacity={0.8}
        disabled={isOverdue}
      >
        <View style={[styles.card, currentScheme === 'dark' && styles.cardDark]}>
          <View style={styles.textContainer}>
            <Text style={[
              styles.title,
              currentScheme === 'dark' && styles.titleDark,
              todo.is_completed && styles.completed
            ]}>
              {todo.title}
            </Text>
            {todo.description && (
              <Text style={[styles.description, currentScheme === 'dark' && styles.dateDark]}>
                {todo.description}
              </Text>
            )}
            <Text style={[styles.date, currentScheme === 'dark' && styles.dateDark]}>
              {formattedDate}
            </Text>
          </View>
          <View style={styles.statusIndicatorContainer}>
            <View style={[styles.statusIndicator, isOverdue && styles.overdueIndicator]}>
              {isOverdue ? (
                <Image source={require('../assets/red_x.png')} style={styles.statusIcon} />
              ) : todo.is_completed ? (
                <Image source={require('../assets/tick.png')} style={styles.statusIcon} />
              ) : (
                <View style={styles.emptyIndicator} />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
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
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  titleDark: {
    color: '#fff',
  },
  description: {
    fontSize: 13,
    color: '#666',
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
  statusIndicatorContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  overdueIndicator: {
    borderColor: '#FF3B30',
  },
  statusIcon: {
    width: 20,
    height: 20,
    tintColor: '#007AFF',
  },
  emptyIndicator: {
    width: 20,
    height: 20,
  }
});

export default TodoItemCard;
