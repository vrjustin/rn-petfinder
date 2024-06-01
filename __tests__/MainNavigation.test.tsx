import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {render} from '@testing-library/react-native';
import store from '../stores/store';
import * as profileReducer from '../reducers/profileReducer';
import ThemeContext from '../contexts/ThemeContext';
import MainNavigation from '../navigation/MainNavigation';
import {guestSignedInProfile} from '../__mocks__/mocks';
import {fetchToken} from '../services/authenticationServices';

jest.mock('@okta/okta-react-native', () => ({
  createConfig: jest.fn(),
  signOut: jest.fn(),
  signInWithBrowser: jest.fn(),
}));

jest.mock('../services/authenticationServices.ts', () => ({
  fetchToken: jest.fn(),
  configureOkta: jest.fn(),
  configureGoogleSignin: jest.fn(),
}));

describe('MainNavigation', () => {
  it('renders Onboarding when shouldOnboard is true', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <ThemeContext.Provider value={false}>
          <MainNavigation />
        </ThemeContext.Provider>
      </Provider>,
    );

    const onboardingPagerView = getByTestId('Onboarding-PagerView');
    expect(onboardingPagerView).toBeTruthy();
  });

  it('renders postOnboardingStack when shouldOnboard is false', () => {
    jest.spyOn(profileReducer, 'profile').mockReturnValue(guestSignedInProfile);
    (fetchToken as jest.Mock).mockResolvedValue(null);

    const {getByTestId} = render(
      <Provider store={store}>
        <ThemeContext.Provider value={false}>
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
        </ThemeContext.Provider>
      </Provider>,
    );

    expect(SplashScreen.hide).toHaveBeenCalled();

    const signUpLoadingIndicator = getByTestId('SignInUp-LoadingIndicator');
    expect(signUpLoadingIndicator).toBeTruthy();
  });
});
