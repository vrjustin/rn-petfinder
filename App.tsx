import React from 'react';
import {TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './stores/store';
import PetTypes from './Views/PetTypes';
import Breeds from './Views/Breeds';
import Animals from './Views/Animals';
import AnimalDetails from './Views/AnimalDetails';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PetTypes" component={PetTypes} />
          <Stack.Screen name="Breeds" component={Breeds} />
          <Stack.Screen
            name="Animals"
            component={Animals}
            options={{
              headerRight: () => (
                <>
                  <TouchableOpacity onPress={console.log('Display Settings Screen')}>
                    <FontAwesomeIcon
                      name="gear"
                      size={20}
                      color="#000"
                      style={{marginRight: 20}}
                    />
                  </TouchableOpacity>
                </>
              ),
            }}
          />
          <Stack.Screen name="AnimalDetails" component={AnimalDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
