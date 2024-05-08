import React, {useContext, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Routes} from '../navigation/Routes';
import PetTypes from '../Views/PetTypes';
import Breeds from '../Views/Breeds';
import Animals from '../Views/Animals';
import Options from '../Views/Options';
import AnimalDetails from '../Views/AnimalDetails';
import Contact from '../Views/Contact';
import Organizations from '../Views/Organizations';
import ThemeContext from '../contexts/ThemeContext';
import Onboarding from '../Views/Onboarding/Onboarding';

const Stack = createStackNavigator();

const useTheme = () => useContext(ThemeContext);

const MainNavigation = () => {
  const isDarkMode = useTheme();
  const headerStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };
  const headerTitleStyle = {
    color: isDarkMode ? 'white' : 'black',
  };
  const [isOnboarding, setIsOnboarding] = useState(true);

  const handleFinishOnboarding = () => {
    setIsOnboarding(false);
  };

  const postOnboardingStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle,
          headerTitleStyle,
        }}>
        <Stack.Screen name={Routes.PetTypes} component={PetTypes} />
        <Stack.Screen name={Routes.Breeds} component={Breeds} />
        <Stack.Screen name={Routes.Animals} component={Animals} />
        <Stack.Screen
          name={Routes.Options}
          component={Options}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen name={Routes.AnimalDetails} component={AnimalDetails} />
        <Stack.Screen
          name={Routes.Contact}
          component={Contact}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen name={Routes.Organizations} component={Organizations} />
      </Stack.Navigator>
    );
  };

  return isOnboarding ? (
    <Onboarding onFinishOnboarding={handleFinishOnboarding} />
  ) : (
    postOnboardingStack()
  );
};

export default MainNavigation;
