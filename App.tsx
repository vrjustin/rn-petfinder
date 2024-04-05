import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PetTypes from './Views/PetTypes';
import Breeds from './Views/Breeds';
import Animals from './Views/Animals';
import AnimalDetails from './Views/AnimalDetails';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PetTypes" component={PetTypes} />
        <Stack.Screen name="Breeds" component={Breeds} />
        <Stack.Screen name="Animals" component={Animals} />
        <Stack.Screen name="AnimalDetails" component={AnimalDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
