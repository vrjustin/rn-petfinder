import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PetTypes from './Views/PetTypes';
import Breeds from './Views/Breeds';
import Animals from './Views/Animals';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PetTypes" component={PetTypes} />
        <Stack.Screen name="Breeds" component={Breeds} />
        <Stack.Screen name="Animals" component={Animals} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
