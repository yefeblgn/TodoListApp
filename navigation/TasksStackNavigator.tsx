import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TasksStackParamList } from './TasksStackParamList';
import TasksScreen from '../screens/TasksScreen';
import AddTaskScreen from './AddTask';
import EditTaskScreen from './EditTask';

const Stack = createNativeStackNavigator<TasksStackParamList>();

const TasksStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TasksScreen" component={TasksScreen} />
      <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
      <Stack.Screen name="EditTaskScreen" component={EditTaskScreen} />
    </Stack.Navigator>
  );
};

export default TasksStackNavigator;
