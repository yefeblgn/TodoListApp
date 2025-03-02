import React from 'react';
import { View } from 'react-native';
import TasksContent from '../components/TasksContent';

const TasksScreen: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <TasksContent />
    </View>
  );
};

export default TasksScreen;
