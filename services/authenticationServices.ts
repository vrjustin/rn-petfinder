import {
  createConfig,
  signInWithBrowser,
  signOut,
} from '@okta/okta-react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import * as Keychain from 'react-native-keychain';
import base64 from 'base-64';
import {setProfile} from '../reducers/profileReducer';
import {Dispatch} from 'redux';
import Profile from '../models/Profile';

const clientId = process.env.OKTA_CLIENT_ID || '';
const redirectUri = process.env.OKTA_REDIRECT_URI || '';
const endSessionRedirectUri = process.env.OKTA_END_SESSION_REDIRECT_URI || '';
const discoveryUri = process.env.OKTA_DISCOVERY_URI || '';
const googleWebClientId = process.env.GOOGLE_CLIENT_ID;

export enum SignInMethod {
  Google = 'google',
  Apple = 'apple',
  Okta = 'okta',
  Guest = 'guest',
}

export const configureOkta = async () => {
  try {
    await createConfig({
      clientId: clientId,
      redirectUri: redirectUri,
      endSessionRedirectUri: endSessionRedirectUri,
      discoveryUri: discoveryUri,
      scopes: ['openid', 'profile', 'offline_access'],
      requireHardwareBackedKeyStore: true,
    });
  } catch (error) {
    console.error('Failed to configure Okta: ', error);
  }
};

export const configureGoogleSignin = async () => {
  GoogleSignin.configure({
    webClientId: googleWebClientId,
    iosClientId: googleWebClientId,
    offlineAccess: true,
  });
};

export const signOutOkta = async () => {
  signOut();
  removeToken();
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    removeToken();
  } catch (error) {
    console.error(error);
  }
};

export const signOutGuest = async () => {
  removeToken();
};

export const handleSignInViaGoogle = async (
  dispatch: Dispatch,
  userProfile: Profile,
) => {
  try {
    await GoogleSignin.hasPlayServices();
    const result = await GoogleSignin.signIn();
    console.log('userInfo is: ', result.user);
    const idToken = result.idToken || '';
    const userName = result.user.email;
    dispatch(
      setProfile({
        ...userProfile,
        isRehydrated: userProfile.isRehydrated,
        shouldOnboard: userProfile.shouldOnboard,
        userName: userName,
        signInMethod: SignInMethod.Google,
      }),
    );
    await Keychain.setGenericPassword('user', idToken);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const handleSignInViaApple = async (
  dispatch: Dispatch,
  userProfile: Profile,
) => {
  try {
    const requestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    console.log('handleSignInViaApple response is: ', requestResponse);
    const credentialState = await appleAuth.getCredentialStateForUser(
      requestResponse.user,
    );
    console.log('handleSignInViaApple credentialState is: ', credentialState);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      console.log('User is authorized...');
      dispatch(
        setProfile({
          ...userProfile,
          isRehydrated: userProfile.isRehydrated,
          shouldOnboard: userProfile.shouldOnboard,
          userName: 'FIXTHIS',
          signInMethod: SignInMethod.Apple,
        }),
      );
      await Keychain.setGenericPassword('user', 'FIX_THIS_APPLE');
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const handleSignInViaGuest = async (
  dispatch: Dispatch,
  userProfile: Profile,
) => {
  dispatch(
    setProfile({
      ...userProfile,
      isRehydrated: userProfile.isRehydrated,
      shouldOnboard: userProfile.shouldOnboard,
      userName: 'GUEST',
      signInMethod: SignInMethod.Guest,
    }),
  );
  await Keychain.setGenericPassword('user', 'guest');
  return true;
};

export const handleSignIn = async (
  dispatch: Dispatch,
  userProfile: Profile,
) => {
  try {
    const result = await signInWithBrowser();
    const decodedToken = decodeJWT(result.access_token);
    const {sub} = decodedToken;
    dispatch(
      setProfile({
        ...userProfile,
        isRehydrated: userProfile.isRehydrated,
        shouldOnboard: userProfile.shouldOnboard,
        userName: sub,
        signInMethod: SignInMethod.Okta,
      }),
    );
    await Keychain.setGenericPassword('user', result.access_token);
    return true;
  } catch (error) {
    console.error('Sign in failed', error);
  }
};

export const fetchToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials;
    }
  } catch (error) {
    console.error('Failed to load token from secure storage', error);
  }
};

const removeToken = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Failed to remove the stored token', error);
  }
};

const decodeJWT = (token: string) => {
  const base64Url = token.split('.')[1];
  const decodedPayload = base64.decode(base64Url); // Use base64.decode to decode the base64Url
  return JSON.parse(decodedPayload);
};
