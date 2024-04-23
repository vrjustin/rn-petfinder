import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import AnimalDetails from '../Views/AnimalDetails';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

let renderedAnimalDetailsTree: any;

describe('AnimalDetails', () => {
  it('renders correctly', async () => {
    await act(async () => {
      renderedAnimalDetailsTree = renderer.create(
        <Provider store={store}>
          <AnimalDetails
            route={{
              params: {
                selectedAnimal: {
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
                  attributes: {
                    declawed: null,
                    house_trained: true,
                    shots_current: true,
                    spayed_neutered: false,
                    special_needs: false,
                  },
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
              },
            }}
          />
        </Provider>,
      );
    });
    expect(renderedAnimalDetailsTree.toJSON()).toMatchSnapshot();
  });
});
