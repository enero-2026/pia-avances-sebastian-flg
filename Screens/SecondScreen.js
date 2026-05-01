import { View, Text } from 'react-native';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Speech from 'expo-speech';

export default function SecondScreen() 
{
  useFocusEffect(
  useCallback(() => {
    Speech.stop();
    Speech.speak("Pantalla dos");
  }, [])
);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Screen 2</Text>
    </View>
  );
}