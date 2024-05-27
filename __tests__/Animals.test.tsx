import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import {waitFor, render, fireEvent} from '@testing-library/react-native';
import Animals from '../Views/Animals';
import {
  mockAnimalResults,
  mockAnimalResultsMultiplePages,
  mockPetTypeDog,
  mockPetTypeFavorites,
  mockBreeds,
  selectedAnimalMock,
} from '../__mocks__/mocks';
import * as reactRedux from 'react-redux';
import * as animalsReducer from '../reducers/animalsReducer';
import * as searchParamsReducer from '../reducers/searchParamsReducer';
import * as profileReducer from '../reducers/profileReducer';
import Profile from '../models/Profile';
import SearchParameters from '../models/SearchParameters';
import {Routes} from '../navigation/Routes';
import apiService from '../services/apiService';

const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    setOptions: mockSetOptions,
  }),
}));

let renderedAnimalsTree: any;

jest.mock('../services/apiService.ts', () => ({
  getAnimals: jest.fn(),
}));

const mockSearchParameters: SearchParameters = {
  location: {
    zipCode: '90210',
  },
  distance: 5,
  tagsPreferred: ['Friendly'],
  breedsPreferred: [],
};

const mockProfile: Profile = {
  shouldOnboard: false,
  isRehydrated: true,
  userName: 'Test-User',
  signInMethod: 'google',
};

describe('Animals', () => {
  it('renders correctly', async () => {
    (apiService.getAnimals as jest.Mock).mockResolvedValueOnce(
      mockAnimalResults,
    );
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

  it('renders correctly when in favorites mode', async () => {
    jest
      .spyOn(animalsReducer, 'selectFavorites')
      .mockReturnValue([selectedAnimalMock]);
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParameters);
    await act(async () => {
      renderedAnimalsTree = renderer.create(
        <Provider store={store}>
          <Animals
            route={{
              key: 'mockKey',
              name: 'Animals',
              params: {
                petType: mockPetTypeFavorites,
                selectedBreeds: mockBreeds,
              },
            }}
          />
        </Provider>,
      );
    });

    expect(renderedAnimalsTree.toJSON()).toMatchSnapshot();
  });

  it('handles favorites properly for selectedAnimal', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(animalsReducer, 'selectAnimals')
      .mockReturnValue([selectedAnimalMock]);
    jest.spyOn(profileReducer, 'profile').mockReturnValue(mockProfile);

    const {getByTestId} = render(
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
    const favoriteButton = getByTestId(
      `Animals-GridItem-${selectedAnimalMock.id}-FavoriteButton`,
    );
    fireEvent.press(favoriteButton);

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('animals/toggleFavorite');
    //TODO: Enhance this is validates the item is now in the favorites slice?
  });

  it('navigates to options screen on press of options button', async () => {
    render(
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

    await waitFor(() => expect(mockSetOptions).toHaveBeenCalled());

    //This will manually call the render function for the headerRight
    //of react navigation. this was the only way to get this to work.
    const headerRight = mockSetOptions.mock.calls[0][0].headerRight;
    const {getByTestId: getByTestIdHeader} = render(headerRight());

    const optionsButton = getByTestIdHeader('Animals-UserOptionsButton');
    fireEvent.press(optionsButton);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.Options, {
      from: 'Animals',
    });
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

  it('navigates back home if we are in favorites mode but no favorites left in array (all were removed)', async () => {
    jest.spyOn(animalsReducer, 'selectFavorites').mockReturnValue([]);
    renderedAnimalsTree = renderer.create(
      <Provider store={store}>
        <Animals
          route={{
            key: 'mockKey',
            name: 'Animals',
            params: {
              petType: mockPetTypeFavorites,
              selectedBreeds: mockBreeds,
            },
          }}
        />
      </Provider>,
    );

    await waitFor(() => ({}));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('handles error when fetchAnimalsData fails', async () => {
    (apiService.getAnimals as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Mocked Error');
    });
    console.error = jest.fn();

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

    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch Animals data: ',
      expect.any(Error),
    );
  });

  it('previous page button dispatches setCurrentPage properly', async () => {
    //totalPages needs to be greater than 1 to rener the paginationHeader to begin with.
    (apiService.getAnimals as jest.Mock).mockResolvedValueOnce(
      mockAnimalResultsMultiplePages,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

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

    const prevPageButton = renderedAnimalsTree.root.findByProps({
      testID: 'AnimalsPagination-PrevButton',
    });
    prevPageButton.props.onPress();

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('animals/setAnimals');
  });

  it('next page button dispatches setCurrentPage properly', async () => {
    //totalPages needs to be greater than 1 to rener the paginationHeader to begin with.
    (apiService.getAnimals as jest.Mock).mockResolvedValueOnce(
      mockAnimalResultsMultiplePages,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

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

    const nextPageButton = renderedAnimalsTree.root.findByProps({
      testID: 'AnimalsPagination-NextButton',
    });
    nextPageButton.props.onPress();

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('animals/setAnimals');
  });
});
