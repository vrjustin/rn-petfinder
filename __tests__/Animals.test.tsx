import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import Animals from '../Views/Animals';
import {
  mockAnimalResults,
  mockPetTypeDog,
  mockBreeds,
} from '../__mocks__/mocks';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    setOptions: jest.fn(),
  }),
}));

let renderedAnimalsTree: any;

jest.mock('../services/apiService.ts', () => ({
  getAnimals: jest.fn(() => mockAnimalResults),
}));

describe('Animals', () => {
  it('renders correctly', async () => {
    await act(async () => {
      renderedAnimalsTree = renderer.create(
        <Provider store={store}>
          <Animals
            route={{
              key: 'mockKey',
              name: 'Animals',
              params: {
                petType: mockPetTypeDog,
                selectedBreeds: mockBreeds,
              },
            }}
          />
        </Provider>,
      );
    });
    expect(renderedAnimalsTree.toJSON()).toMatchSnapshot();
  });

  it('toggles to gridview correctly', async () => {
    renderedAnimalsTree = renderer.create(
      <Provider store={store}>
        <Animals
          route={{
            key: 'mockKey',
            name: 'Animals',
            params: {
              petType: mockPetTypeDog,
              selectedBreeds: mockBreeds,
            },
          }}
        />
      </Provider>,
    );

    const toggleButton = renderedAnimalsTree.root.findByProps({
      testID: 'toggleGridButton',
    });
    const initialColor = toggleButton.props.children.props.color;
    toggleButton.props.onPress();

    const updatedColor = toggleButton.props.children.props.color;
    expect(updatedColor).toBe(initialColor === 'black' ? 'gray' : 'black');
  });

  it('toggles to listview correctly', async () => {
    renderedAnimalsTree = renderer.create(
      <Provider store={store}>
        <Animals
          route={{
            key: 'mockKey',
            name: 'Animals',
            params: {
              petType: mockPetTypeDog,
              selectedBreeds: mockBreeds,
            },
          }}
        />
      </Provider>,
    );

    const toggleButton = renderedAnimalsTree.root.findByProps({
      testID: 'toggleListButton',
    });
    const initialColor = toggleButton.props.children.props.color;
    toggleButton.props.onPress();

    const updatedColor = toggleButton.props.children.props.color;
    expect(updatedColor).toBe(initialColor === 'black' ? 'gray' : 'black');
  });
});
