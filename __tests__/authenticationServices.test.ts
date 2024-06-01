import * as reactRedux from 'react-redux';
import Keychain from 'react-native-keychain';
import {
  createConfig,
  signOut,
  signInWithBrowser,
} from '@okta/okta-react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  configureOkta,
  configureGoogleSignin,
  signOutOkta,
  signOutGoogle,
  signOutGuest,
  handleSignInViaGoogle,
  handleSignInViaApple,
  handleSignInViaGuest,
  handleSignIn,
  fetchToken,
} from '../services/authenticationServices';
import {signedOutProfile} from '../__mocks__/mocks';
import fakeJWT from '../__mocks__/jwtMock';

jest.mock('@okta/okta-react-native', () => ({
  createConfig: jest.fn(),
  signOut: jest.fn(),
  signInWithBrowser: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    signOut: jest.fn(),
    signIn: jest.fn(),
    hasPlayServices: jest.fn(),
  },
}));

jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: {
    performRequest: jest.fn(),
    getCredentialStateForUser: jest.fn(),
    Operation: {
      LOGIN: 1,
    },
    Scope: {
      FULL_NAME: 1,
      EMAIL: 0,
    },
    State: {
      AUTHORIZED: 1,
    },
  },
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

describe('authenticationServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls createConfig when we configureOkta', async () => {
    await configureOkta();

    expect(createConfig).toHaveBeenCalledWith({
      clientId: process.env.OKTA_CLIENT_ID,
      redirectUri: process.env.OKTA_REDIRECT_URI,
      endSessionRedirectUri: process.env.OKTA_END_SESSION_REDIRECT_URI,
      discoveryUri: process.env.OKTA_DISCOVERY_URI,
      scopes: ['openid', 'profile', 'offline_access'],
      requireHardwareBackedKeyStore: true,
    });
  });

  it('catches error properly if okta createConfig fails', async () => {
    const mockError = new Error('Failed to configure okta properly');
    (createConfig as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    await configureOkta();

    expect(console.error).toHaveBeenCalledWith(
      'Failed to configure Okta: ',
      expect.any(Error),
    );
  });

  it('calls GoogleSingin.configure when we configureGoogleSignin', async () => {
    await configureGoogleSignin();

    expect(GoogleSignin.configure).toHaveBeenCalledWith({
      webClientId: process.env.GOOGLE_CLIENT_ID,
      iosClientId: process.env.GOOGLE_CLIENT_ID,
      offlineAccess: true,
    });
  });

  it('calls signOut and removeToken when we signOutOkta', async () => {
    (Keychain.resetGenericPassword as jest.Mock).mockResolvedValueOnce(true);
    await signOutOkta();

    expect(signOut).toHaveBeenCalled();
    expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  });

  it('catches error properly when Keychain.resetGenericPassword fails', async () => {
    const mockError = new Error('Failed to resetGenericPassword in Keychain');
    (Keychain.resetGenericPassword as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    await signOutOkta();

    expect(signOut).toHaveBeenCalled();
    expect(Keychain.resetGenericPassword).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to remove the stored token',
      expect.any(Error),
    );
  });

  it('calls GoogleSignIn.signOut and removeToken when we signOutGoogle', async () => {
    await signOutGoogle();

    expect(GoogleSignin.signOut).toHaveBeenCalled();
    expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  });

  it('catches error properly when GoogleSignIn.signOut fails', async () => {
    const mockError = new Error(
      'Failed to signOut from GoogleSignin.signOut()',
    );
    (GoogleSignin.signOut as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    await signOutGoogle();

    expect(console.error).toHaveBeenCalledWith(
      'Failed to signOut of Google: ',
      expect.any(Error),
    );
  });

  it('calls removeToken when we signOutGuest', async () => {
    await signOutGuest();

    expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  });

  it('handles signInViaGoogle properly', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    (GoogleSignin.signIn as jest.Mock).mockReturnValue({
      idToken: 'mocked-return-id-token',
      user: {
        email: 'test.email@yada.com',
      },
    });

    const signInSuccess = await handleSignInViaGoogle(
      mockDispatch,
      signedOutProfile,
    );

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(signInSuccess).toBe(true);
    expect(dispatchedAction.type).toBe('profile/setProfile');
    expect(dispatchedAction.payload).toEqual({
      isRehydrated: false,
      shouldOnboard: false,
      signInMethod: 'google',
      userName: 'test.email@yada.com',
    });
  });

  it('catches error properly when GoogleSignIn.signIn fails', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    const mockError = new Error('Failed to resetGenericPassword in Keychain');
    (GoogleSignin.signIn as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    const signInSuccess = await handleSignInViaGoogle(
      mockDispatch,
      signedOutProfile,
    );

    expect(signInSuccess).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Failed to signIn Google: ',
      expect.any(Error),
    );
  });

  it('handles signInViaApple properly', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    (appleAuth.performRequest as jest.Mock).mockReturnValue({
      nonce: 'mocked-nonce',
      user: 'apple-user-mock',
      fullName: 'apple user mock',
      realUserStatus: 1,
      authorizedScopes: [],
      identityToken: 'mocked-identity-token',
      email: 'mocked-email@email.com',
      state: null,
      authorizationCode: null,
    });
    (appleAuth.getCredentialStateForUser as jest.Mock).mockReturnValue(1);

    const signInSuccess = await handleSignInViaApple(
      mockDispatch,
      signedOutProfile,
    );

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(signInSuccess).toBe(true);
    expect(dispatchedAction.type).toBe('profile/setProfile');
    expect(dispatchedAction.payload).toEqual({
      isRehydrated: false,
      shouldOnboard: false,
      signInMethod: 'apple',
      userName: 'FIXTHIS',
    });
  });

  it('catches error properly when appleAuth.performRequest fails', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    const mockError = new Error('Failed to resetGenericPassword in Keychain');
    (appleAuth.performRequest as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    const signInSuccess = await handleSignInViaApple(
      mockDispatch,
      signedOutProfile,
    );

    expect(signInSuccess).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Failed to signIn via appleAuth: ',
      expect.any(Error),
    );
  });

  it('returns false if appleAuth.performRequest succeeds but user is not AUTHORIZED', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    (appleAuth.performRequest as jest.Mock).mockReturnValue({
      nonce: 'mocked-nonce',
      user: 'apple-user-mock',
      fullName: 'apple user mock',
      realUserStatus: 1,
      authorizedScopes: [],
      identityToken: 'mocked-identity-token',
      email: 'mocked-email@email.com',
      state: null,
      authorizationCode: null,
    });
    (appleAuth.getCredentialStateForUser as jest.Mock).mockReturnValue(0);

    const signInSuccess = await handleSignInViaApple(
      mockDispatch,
      signedOutProfile,
    );

    expect(signInSuccess).toBe(false);
  });

  it('handles signInViaGuest', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    const signInSuccess = await handleSignInViaGuest(
      mockDispatch,
      signedOutProfile,
    );

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(signInSuccess).toBe(true);
    expect(dispatchedAction.type).toBe('profile/setProfile');
    expect(dispatchedAction.payload).toEqual({
      isRehydrated: false,
      shouldOnboard: false,
      signInMethod: 'guest',
      userName: 'GUEST',
    });
  });

  it('handles signInViaOkta properly', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    (signInWithBrowser as jest.Mock).mockReturnValue({
      resolve_type: 'mocked-resolve-type',
      access_token: fakeJWT,
    });

    const signInSuccess = await handleSignIn(mockDispatch, signedOutProfile);

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(signInSuccess).toBe(true);
    expect(dispatchedAction.type).toBe('profile/setProfile');
    expect(dispatchedAction.payload).toEqual({
      isRehydrated: false,
      shouldOnboard: false,
      signInMethod: 'okta',
      userName: 'test.email@yada.com',
    });
  });

  it('catches the error properly when signInWithBrowser fails', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    const mockError = new Error('Failed to resetGenericPassword in Keychain');
    (signInWithBrowser as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    const signInSuccess = await handleSignIn(mockDispatch, signedOutProfile);

    expect(signInSuccess).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Sign in via Okta failed: ',
      expect.any(Error),
    );
  });

  it('fetches token from Keychain properly', async () => {
    const mockReturnCredentials = {
      username: 'mock-user-name',
      password: 'mock-password',
    };
    (Keychain.getGenericPassword as jest.Mock).mockReturnValue(
      mockReturnCredentials,
    );

    const credentials = await fetchToken();

    expect(credentials).toEqual(mockReturnCredentials);
  });

  it('fetches token and returns undefined if Keychain.getGenericPassword succeeds but no credentials found', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockReturnValue(undefined);

    const credentials = await fetchToken();

    expect(credentials).toBe(undefined);
  });

  it('catches the error properly when Keychain.getGenericPassword fails', async () => {
    const mockError = new Error('Failed to resetGenericPassword in Keychain');
    (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    const credentials = await fetchToken();

    expect(credentials).toBe(undefined);
    expect(console.error).toHaveBeenCalledWith(
      'Failed to load token from secure storage',
      expect.any(Error),
    );
  });
});
