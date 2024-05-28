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

jest.mock('../Views/PetTypes.tsx');

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
