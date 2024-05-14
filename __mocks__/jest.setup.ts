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
