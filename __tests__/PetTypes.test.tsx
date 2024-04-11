import React from 'react';
import renderer, {act} from 'react-test-renderer';
import PetTypes from '../Views/PetTypes';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
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
  it('renders correctly', async () => {
    await act(async () => {
      renderedPetTypesTree = renderer.create(<PetTypes />);
    });
    expect(renderedPetTypesTree.toJSON()).toMatchSnapshot();
  });
});
