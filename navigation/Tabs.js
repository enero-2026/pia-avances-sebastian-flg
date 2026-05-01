import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CamaraScreen from '../Screens/CamaraScreen';
import SecondScreen from '../Screens/SecondScreen';

const Tab = createMaterialTopTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Camara"
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Camara" component={CamaraScreen} />
      <Tab.Screen name="Second" component={SecondScreen} />
    </Tab.Navigator>
  );
}