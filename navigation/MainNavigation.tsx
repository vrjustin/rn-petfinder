import React, {useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import {Routes} from '../navigation/Routes';
import {profile, setProfile} from '../reducers/profileReducer';
import PetTypes from '../Views/PetTypes';
import Breeds from '../Views/Breeds';
import Animals from '../Views/Animals';
import Options from '../Views/Options';
import AnimalDetails from '../Views/AnimalDetails';
import Contact from '../Views/Contact';
import Organizations from '../Views/Organizations';
import ThemeContext from '../contexts/ThemeContext';
import Onboarding from '../Views/Onboarding/Onboarding';
import SignInUp from '../Views/SignInUp';

const Stack = createStackNavigator();

const useTheme = () => useContext(ThemeContext);

const MainNavigation = () => {
  const dispatch = useDispatch();
  const isDarkMode = useTheme();
  const headerStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };
  const headerTitleStyle = {
    color: isDarkMode ? 'white' : 'black',
  };
  const {shouldOnboard, isRehydrated} = useSelector(profile);

  const handleFinishOnboarding = () => {
    dispatch(
      setProfile({
        ...profile,
        shouldOnboard: false,
        isRehydrated: isRehydrated,
      }),
    );
  };

  const postOnboardingStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle,
          headerTitleStyle,
        }}>
        <Stack.Screen
          name={Routes.SignInUp}
          component={SignInUp}
          options={{headerShadowVisible: false, headerTitle: () => null}}
        />
        <Stack.Screen
          name={Routes.PetTypes}
          component={PetTypes}
          options={{headerLeft: () => null}}
        />
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

  if (isRehydrated) {
    SplashScreen.hide();
  }

  return shouldOnboard ? (
    <Onboarding onFinishOnboarding={handleFinishOnboarding} />
  ) : (
    postOnboardingStack()
  );
};

export default MainNavigation;
