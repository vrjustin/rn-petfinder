import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer from 'react-test-renderer';
import PetTypes from '../Views/PetTypes';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistStore: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  getPetTypes: jest.fn(() => ({
    types: [
      {
        name: 'Dog',
        coats: ['Short'],
        colors: ['Brown'],
        genders: ['Male'],
        _links: {self: {href: ''}, breeds: {href: ''}},
      },
      {
        name: 'Cat',
        coats: ['Long'],
        colors: ['Black'],
        genders: ['Female'],
        _links: {self: {href: ''}, breeds: {href: ''}},
      },
      {
        name: 'Bird',
        coats: [],
        colors: ['Green'],
        genders: ['Unknown'],
        _links: {self: {href: ''}, breeds: {href: ''}},
      },
    ],
  })),
}));

let renderedPetTypesTree: any;

describe('PetTypes', () => {
  it('renders correctly when no petTypes local and is loading', () => {
    renderedPetTypesTree = renderer.create(
      <Provider store={store}>
        <PetTypes />
      </Provider>,
    );
    expect(renderedPetTypesTree.toJSON()).toMatchSnapshot();
  });
});
