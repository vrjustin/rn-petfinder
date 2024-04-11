import React from 'react';
import renderer, {act} from 'react-test-renderer';
import Breeds from '../Views/Breeds';
import {BreedsScreenRouteProp} from '../types/NavigationTypes';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
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

describe('Breeds', () => {
  it('renders correctly', async () => {
    let renderedBreedsTree: any;
    await act(async () => {
      renderedBreedsTree = renderer.create(
        <Breeds
          route={{params: {petTypeName: 'Dog'}} as BreedsScreenRouteProp}
        />,
      );
    });
    expect(renderedBreedsTree.toJSON()).toMatchSnapshot();
  });
});
