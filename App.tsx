import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import TasksStackNavigator from './navigation/TasksStackNavigator';
import SettingsScreen from './screens/SettingsScreen';
import IntroScreen from './screens/IntroScreen';
import LoginScreen from './screens/LoginScreen';
import { TodoProvider } from './context/TodoContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const MainTabs: React.FC = () => {
  const { currentScheme } = useContext(ThemeContext);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: currentScheme === 'dark' ? '#333' : '#fff',
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarIcon: ({ focused }) => {
          let source;
          if (route.name === 'Home') {
            source = require('./assets/menu.png');
          } else if (route.name === 'TasksStack') {
            source = require('./assets/missions.png');
          } else if (route.name === 'Settings') {
            source = require('./assets/settings.png');
          }
          return (
            <Image
              source={source}
              style={{
                width: 24,
                height: 24,
                tintColor: focused
                  ? currentScheme === 'dark'
                    ? '#fff'
                    : '#007AFF'
                  : currentScheme === 'dark'
                  ? '#aaa'
                  : '#8e8e93',
              }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="TasksStack" component={TasksStackNavigator} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigatorContainer: React.FC = () => {
  const { currentScheme } = useContext(ThemeContext);
  const navigationTheme: NavigationTheme =
    currentScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Intro" component={IntroScreen} />
        <RootStack.Screen name="Auth" component={LoginScreen} />
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TodoProvider>
          <AppNavigatorContainer />
        </TodoProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
