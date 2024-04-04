import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PetTypes from './Views/PetTypes';
import Breeds from './Views/Breeds';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PetTypes" component={PetTypes} />
        <Stack.Screen name="BreedsScreen" component={Breeds} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
