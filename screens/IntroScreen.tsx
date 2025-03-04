import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IntroScreen = () => {
  const navigation = useNavigation();

  const handleVideoEnd = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('Auth');
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/intro.mp4')}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            handleVideoEnd();
          }
        }}
      />
      <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9eff5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
  },
});

export default IntroScreen;
