import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Tabs from './navigation/Tabs';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}