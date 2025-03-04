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

const ACTION_WIDTH = 80;

const TodoItemCard: React.FC<TodoItemCardProps> = ({ todo, onDelete, onEdit, onToggle }) => {
  const { currentScheme } = useContext(ThemeContext);
  const now = new Date();
  // Using due_date instead of date
  const isOverdue = now >= todo.due_date;

  // Tarihi istenen formata çevirmek için yardımcı fonksiyon
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const monthNames = [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ];
    const monthName = monthNames[monthIndex];
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${day} ${monthName}, ${year} - Saat ${formattedHours}:${formattedMinutes}`;
  };

  const renderLeftActions = (progress: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation) => {
    const scale = dragX.interpolate({
      inputRange: [0, ACTION_WIDTH],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    const translateX = dragX.interpolate({
      inputRange: [0, ACTION_WIDTH],
      outputRange: [-20, 0],
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
      inputRange: [-ACTION_WIDTH, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    const translateX = dragX.interpolate({
      inputRange: [-ACTION_WIDTH, 0],
      outputRange: [0, 20],
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
            {todo.description ? (
              <Text style={[
                styles.description,
                currentScheme === 'dark' && styles.descriptionDark
              ]}>
                {todo.description}
              </Text>
            ) : null}
            <Text style={[
              styles.date,
              currentScheme === 'dark' && styles.dateDark
            ]}>
              {todo.due_date ? formatDate(new Date(todo.due_date)) : 'Tarih yok'}
            </Text>
          </View>
          <View style={styles.statusIndicator}>
            {isOverdue ? (
              <Image source={require('../assets/red_x.png')} style={styles.statusIcon} />
            ) : todo.is_completed ? (
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
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#444',
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
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  descriptionDark: {
    color: '#ccc',
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
    borderRadius: 10,
  },
  actionIcon: {
    width: 26,
    height: 26,
    tintColor: '#fff',
  },
  statusIndicator: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
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
