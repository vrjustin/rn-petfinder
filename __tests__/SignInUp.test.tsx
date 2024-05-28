import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import SignInUp from '../Views/SignInUp';
import {Routes} from '../navigation/Routes';
import {
  handleSignInViaGoogle,
  handleSignIn,
  handleSignInViaGuest,
  fetchToken,
} from '../services/authenticationServices';
import SplashScreen from 'react-native-splash-screen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    setOptions: jest.fn(),
  }),
}));

jest.mock('../services/authenticationServices.ts', () => ({
  configureGoogleSignin: jest.fn(),
  configureOkta: jest.fn(),
  signOutOkta: jest.fn(),
  signOutGoogle: jest.fn(),
  signOutGuest: jest.fn(),
  handleSignInViaGoogle: jest.fn(),
  handleSignInViaGuest: jest.fn(),
  handleSignIn: jest.fn(),
  fetchToken: jest.fn(() => Promise.resolve(null)),
}));

let renderedSignInUpTree: any;

describe('SignInUp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly when initialLoading true', async () => {
    act(() => {
      renderedSignInUpTree = renderer.create(
        <Provider store={store}>
          <SignInUp initialLoadingProp={true} />
        </Provider>,
      );
    });

    // Fast-forwrad timers
    jest.advanceTimersByTime(600);

    expect(renderedSignInUpTree.toJSON()).toMatchSnapshot();
  });

  it('renders correctly when initialLoading false', async () => {
    act(() => {
      renderedSignInUpTree = renderer.create(
        <Provider store={store}>
          <SignInUp initialLoadingProp={false} />
        </Provider>,
      );
    });

    // Fast-forwrad timers
    jest.advanceTimersByTime(600);

    expect(renderedSignInUpTree.toJSON()).toMatchSnapshot();
  });

  it('calls handleSignInGooglePress when google sign touchable is pressed and navigates if success', async () => {
    (handleSignInViaGoogle as jest.Mock).mockResolvedValue(true);

    const {getByTestId} = render(
      <Provider store={store}>
        <SignInUp initialLoadingProp={false} />
      </Provider>,
    );

    const googleButton = getByTestId('SignInUp-Button-GoogleSignIn');
    fireEvent.press(googleButton);
    await Promise.resolve();

    expect(handleSignInViaGoogle).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(Routes.PetTypes);
  });

  it('calls handleSignInOktaPress when okta sign touchable is pressed and navigates if success', async () => {
    (handleSignIn as jest.Mock).mockResolvedValue(true);

    const {getByTestId} = render(
      <Provider store={store}>
        <SignInUp initialLoadingProp={false} />
      </Provider>,
    );

    const oktaButton = getByTestId('SignInUp-Button-OktaSignIn');
    fireEvent.press(oktaButton);
    await Promise.resolve();

    expect(handleSignIn).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(Routes.PetTypes);
  });

  it('calls handleGuestPress when guest sign touchable is pressed and navigates if success', async () => {
    (handleSignInViaGuest as jest.Mock).mockResolvedValue(true);

    const {getByTestId} = render(
      <Provider store={store}>
        <SignInUp initialLoadingProp={false} />
      </Provider>,
    );

    const guestButton = getByTestId('SignInUp-Button-Guest');
    fireEvent.press(guestButton);
    await Promise.resolve();

    expect(handleSignInViaGuest).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(Routes.PetTypes);
  });

  it('calls handleSignInGooglePress when google sign touchable is pressed no navigation if failed', async () => {
    (handleSignInViaGoogle as jest.Mock).mockResolvedValue(false);

    const {getByTestId} = render(
      <Provider store={store}>
        <SignInUp initialLoadingProp={false} />
      </Provider>,
    );

    const googleButton = getByTestId('SignInUp-Button-GoogleSignIn');
    fireEvent.press(googleButton);
    await Promise.resolve();

    expect(handleSignInViaGoogle).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  it('calls handleSignInOktaPress when okta sign touchable is pressed no navigation if failed', async () => {
    (handleSignIn as jest.Mock).mockResolvedValue(false);

    const {getByTestId} = render(
      <Provider store={store}>
        <SignInUp initialLoadingProp={false} />
      </Provider>,
    );

    const oktaButton = getByTestId('SignInUp-Button-OktaSignIn');
    fireEvent.press(oktaButton);
    await Promise.resolve();

    expect(handleSignIn).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  it('calls handleGuestPress when guest sign touchable is pressed no navigation if failed', async () => {
    (handleSignInViaGuest as jest.Mock).mockResolvedValue(false);

    const {getByTestId} = render(
      <Provider store={store}>
        <SignInUp initialLoadingProp={false} />
      </Provider>,
    );

    const guestButton = getByTestId('SignInUp-Button-Guest');
    fireEvent.press(guestButton);
    await Promise.resolve();

    expect(handleSignInViaGuest).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  it('calls fetchToken and navigates to PetTypes if credentials found', async () => {
    const mockCredentials = {
      username: 'test_username',
      password: 'test_password',
    };
    (fetchToken as jest.Mock).mockResolvedValue(mockCredentials);

    render(
      <Provider store={store}>
        <SignInUp initialLoadingProp={false} />
      </Provider>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(Routes.PetTypes);
    });

    jest.advanceTimersByTime(600);

    expect(SplashScreen.hide).toHaveBeenCalled();
  });
});
