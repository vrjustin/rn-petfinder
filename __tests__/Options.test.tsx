import React from 'react';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import store from '../stores/store';
import Options from '../Views/Options';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistStore: jest.fn(),
}));

let renderedOptionsTree: any;

describe('Options', () => {
  it('renders correctly', () => {
    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options route={{params: {from: 'hello'}}} />
      </Provider>,
    );
    expect(renderedOptionsTree.toJSON()).toMatchSnapshot();
  });
});
