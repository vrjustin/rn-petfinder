import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import Animals from '../Views/Animals';
import {PetType} from '../models/PetType';
import Breed from '../models/Breed';
import {AnimalResults} from '../services/apiService';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

const animalResults: AnimalResults = {
  animalsData: [
    {
      id: 1,
      organization_id: 'org1',
      url: 'https://example.com',
      age: 'Young',
      gender: 'Female',
      size: 'Medium',
      coat: 'Short',
      name: 'Fluffy',
      description: 'A fluffy dog',
      status: 'Available',
      breeds: {
        mixed: false,
        primary: 'Poodle',
        secondary: null,
        unknown: false,
      },
      colors: {
        primary: 'White',
        secondary: null,
        tertiary: null,
      },
      contact: {
        address: {
          address1: '123 Main St',
          address2: null,
          city: 'Anytown',
          country: 'USA',
          postcode: '12345',
          state: 'NY',
        },
        email: 'email@example.com',
        phone: '555-123-4567',
      },
      photos: [
        {
          full: 'https://example.com/full.jpg',
          large: 'https://example.com/large.jpg',
          medium: 'https://example.com/medium.jpg',
          small: 'https://example.com/small.jpg',
        },
      ],
      primary_photo_cropped: {
        full: 'https://example.com/full.jpg',
        large: 'https://example.com/large.jpg',
        medium: 'https://example.com/medium.jpg',
        small: 'https://example.com/small.jpg',
      },
      species: 'Dog',
      tags: ['Friendly', 'Playful'],
      isFavorite: false,
    },
  ],
  pagination: {current_page: 1, total_pages: 1},
};

const mockedPetType: PetType = {
  displayName: 'Dog',
  name: 'Dog',
  coats: [],
  colors: [],
  genders: [],
  _links: {
    self: {href: ''},
    breeds: {href: ''},
  },
};

const mockBreeds: Breed[] = [
  {
    name: 'Poodle',
    _links: {
      type: {href: ''},
    },
  },
];

let renderedAnimalsTree: any;

jest.mock('../services/apiService.ts', () => ({
  getAnimals: jest.fn(() => animalResults),
}));

describe('Animals', () => {
  it('renders correctly', async () => {
    await act(async () => {
      renderedAnimalsTree = renderer.create(
        <Provider store={store}>
          <Animals
            route={{
              params: {
                petType: mockedPetType,
                selectedBreeds: mockBreeds,
              },
            }}
          />
        </Provider>,
      );
    });
    expect(renderedAnimalsTree.toJSON()).toMatchSnapshot();
  });
});
