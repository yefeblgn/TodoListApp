import 'react-native-gesture-handler';
import React from 'react';
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
import ProfileScreen from './screens/ProfileScreen';
import IntroScreen from './screens/IntroScreen';
import LoginScreen from './screens/LoginScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';

import { TodoProvider } from './context/TodoContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const MainTabs: React.FC<{ currentScheme: 'light' | 'dark' }> = ({ currentScheme }) => {
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
          } else if (route.name === 'Profile') {
            source = require('./assets/profile.png');
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
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigatorContainer: React.FC<{ currentScheme: 'light' | 'dark' }> = ({ currentScheme }) => {
  const navigationTheme: NavigationTheme =
    currentScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Intro" component={IntroScreen} />
        <RootStack.Screen name="Auth" component={LoginScreen} />
        <RootStack.Screen name="Main">
          {() => <MainTabs currentScheme={currentScheme} />}
        </RootStack.Screen>
        <RootStack.Screen name="History" component={HistoryScreen} />
        <RootStack.Screen name="Settings" component={SettingsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <UserProvider>
          <TodoProvider>
            <ThemeContext.Consumer>
              {({ currentScheme }) => <AppNavigatorContainer currentScheme={currentScheme} />}
            </ThemeContext.Consumer>
          </TodoProvider>
        </UserProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
