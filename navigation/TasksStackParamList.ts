import { Todo } from '../context/TodoContext';

export type TasksStackParamList = {
  TasksScreen: undefined;
  AddTaskScreen: undefined;
  EditTaskScreen: { todo: Todo }; 
};