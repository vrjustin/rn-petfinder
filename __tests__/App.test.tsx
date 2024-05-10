/**
 * @format
 */

import 'react-native';
import React from 'react';
import store from '../stores/store';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer, {act} from 'react-test-renderer';
import {Provider} from 'react-redux';

jest.mock('../Views/PetTypes.tsx');

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistStore: jest.fn(),
}));

let renderedAppTree: any;

it('renders correctly', async () => {
  await act(async () => {
    renderedAppTree = renderer.create(
      <Provider store={store}>
        <App />
      </Provider>,
    );
  });
  expect(renderedAppTree.toJSON()).toMatchSnapshot();
});
