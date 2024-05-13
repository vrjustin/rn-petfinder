import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import AnimalDetails from '../Views/AnimalDetails';
import {selectedAnimalMock} from '../__mocks__/mocks';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    setOptions: jest.fn(),
  }),
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
                selectedAnimal: selectedAnimalMock,
              },
            }}
          />
        </Provider>,
      );
    });
    expect(renderedAnimalDetailsTree.toJSON()).toMatchSnapshot();
  });
});
