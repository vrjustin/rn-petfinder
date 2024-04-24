import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './stores/store';
import PetTypes from './Views/PetTypes';
import Breeds from './Views/Breeds';
import Animals from './Views/Animals';
import Options from './Views/Options';
import AnimalDetails from './Views/AnimalDetails';
import ThemeContext from './contexts/ThemeContext';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const [isDarkMode] = useState(false);
  return (
    <Provider store={store}>
      <ThemeContext.Provider value={isDarkMode}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="PetTypes" component={PetTypes} />
            <Stack.Screen name="Breeds" component={Breeds} />
            <Stack.Screen name="Animals" component={Animals} />
            <Stack.Screen
              name="Options"
              component={Options}
              options={{presentation: 'modal'}}
            />
            <Stack.Screen name="AnimalDetails" component={AnimalDetails} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeContext.Provider>
    </Provider>
  );
}

export default App;
