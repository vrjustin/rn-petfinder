import React from 'react';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import store from '../stores/store';
import Options from '../Views/Options';

let renderedOptionsTree: any;

describe('Options', () => {
  it('renders correctly', () => {
    renderedOptionsTree = renderer.create(
      <Provider store={store}>
        <Options />
      </Provider>,
    );
    expect(renderedOptionsTree.toJSON()).toMatchSnapshot();
  });
});
