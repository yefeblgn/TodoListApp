import React from 'react';
import { View } from 'react-native';
import SettingsContent from '../components/SettingsContent';

const SettingsScreen: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <SettingsContent />
    </View>
  );
};

export default SettingsScreen;
