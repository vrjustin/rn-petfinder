import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import Breeds from '../Views/Breeds';
import {BreedsScreenRouteProp} from '../types/NavigationTypes';
import {PetType} from '../models/PetType';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  getPetBreeds: jest.fn(() => [
    {
      name: 'Bulldog',
      _links: {type: {href: ''}},
    },
    {
      name: 'Labrador',
      _links: {type: {href: ''}},
    },
    {
      name: 'Poodle',
      _links: {type: {href: ''}},
    },
  ]),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistStore: jest.fn(),
}));

describe('Breeds', () => {
  it('renders correctly', async () => {
    let renderedBreedsTree: any;
    let mockedPetType: PetType = {
      name: 'Dog',
      coats: [],
      colors: [],
      genders: [],
      _links: {
        self: {href: ''},
        breeds: {href: ''},
      },
    };

    await act(async () => {
      renderedBreedsTree = renderer.create(
        <Provider store={store}>
          <Breeds
            route={{params: {petType: mockedPetType}} as BreedsScreenRouteProp}
          />
        </Provider>,
      );
    });
    expect(renderedBreedsTree.toJSON()).toMatchSnapshot();
  });
});
