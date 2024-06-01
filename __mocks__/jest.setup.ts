require('dotenv').config({path: '.env.test'});

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

jest.mock('@invertase/react-native-apple-authentication', () => ({
  appleAuth: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({}));

jest.mock('react-native-flipper', () => ({
  addPlugin: jest.fn(),
}));
