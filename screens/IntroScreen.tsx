import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';

const IntroScreen = () => {
  const navigation = useNavigation();
  const [isAssetLoaded, setIsAssetLoaded] = useState(false);
  const videoSource = require('../assets/videos/intro.mp4');

  useEffect(() => {
    async function loadAsset() {
      await Asset.loadAsync(videoSource);
      setIsAssetLoaded(true);
    }
    loadAsset();
  }, []);

  const handleVideoEnd = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('Auth');
    }
  };

  // Asset yüklenene kadar boş bir View render ediyoruz.
  if (!isAssetLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Video
        source={videoSource}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            handleVideoEnd();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default IntroScreen;
