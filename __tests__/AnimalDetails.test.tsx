import React from 'react';
import renderer, {act} from 'react-test-renderer';
import AnimalDetails from '../Views/AnimalDetails';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

let renderedAnimalDetailsTree: any;

describe('AnimalDetails', () => {
  it('renders correctly', async () => {
    await act(async () => {
      renderedAnimalDetailsTree = renderer.create(
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
        />,
      );
    });
    expect(renderedAnimalDetailsTree.toJSON()).toMatchSnapshot();
  });
});
