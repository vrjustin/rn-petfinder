import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer from 'react-test-renderer';
import SignInUp from '../Views/SignInUp';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

let renderedSignInUpTree: any;

describe('SignInUp', () => {
  it('renders correctly when initialLoading true', async () => {
    renderedSignInUpTree = renderer.create(
      <Provider store={store}>
        <SignInUp />
      </Provider>,
    );

    expect(renderedSignInUpTree.toJSON()).toMatchSnapshot();
  });

  it('renders correctly when loading complete', async () => {
    renderedSignInUpTree = renderer.create(
      <Provider store={store}>
        <SignInUp initialLoadingProp={false} />
      </Provider>,
    );

    expect(renderedSignInUpTree.toJSON()).toMatchSnapshot();
  });
});
