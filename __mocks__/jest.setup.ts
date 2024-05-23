jest.mock('axios');

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistStore: jest.fn(),
}));

jest.mock('react-native-splash-screen', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('@okta/okta-react-native', () => ({
  createConfig: jest.fn(),
  signOut: jest.fn(),
  signInWithBrowser: jest.fn(),
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

jest.mock('@react-native-google-signin/google-signin', () => ({}));

jest.mock('react-native-flipper', () => ({
  addPlugin: jest.fn(),
}));
