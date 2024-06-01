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
  mockSearchParams,
  googleSignedInProfile,
} from '../__mocks__/mocks';
import * as reactRedux from 'react-redux';
import * as animalsReducer from '../reducers/animalsReducer';
import * as searchParamsReducer from '../reducers/searchParamsReducer';
import * as profileReducer from '../reducers/profileReducer';
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
      .mockReturnValue(mockSearchParams);
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
    jest
      .spyOn(profileReducer, 'profile')
      .mockReturnValue(googleSignedInProfile);

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

  it('handles navigation to AnimalDetails on selecting animal', async () => {
    jest
      .spyOn(animalsReducer, 'selectAnimals')
      .mockReturnValue([selectedAnimalMock]);

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

    await waitFor(() => {});

    const selectAnimalButton = getByTestId(
      `Animals-AnimalButton-${selectedAnimalMock.id}`,
    );
    fireEvent.press(selectAnimalButton);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.AnimalDetails, {
      selectedAnimal: selectedAnimalMock,
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
    jest
      .spyOn(animalsReducer, 'selectAnimals')
      .mockReturnValue([selectedAnimalMock]);

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

    const animalSelectButton = renderedAnimalsTree.root.findByProps({
      testID: `Animals-AnimalListButton-${selectedAnimalMock.id}`,
    });
    animalSelectButton.props.onPress();

    const updatedColor = toggleButton.props.children.props.color;
    expect(updatedColor).toBe(initialColor === 'black' ? 'gray' : 'black');
    expect(mockNavigate).toHaveBeenCalledWith(Routes.AnimalDetails, {
      selectedAnimal: selectedAnimalMock,
    });
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
    (apiService.getAnimals as jest.Mock).mockResolvedValueOnce(
      mockAnimalResultsMultiplePages,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);

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

    const dispatchedAction = mockDispatch.mock.calls[2][0];
    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.animalsPagination.currentPage).toBe(
      mockSearchParams.animalsPagination.currentPage - 1,
    );
  });

  it('previous page button does not dispatch setCurrentPage if isLoading is true', async () => {
    (apiService.getAnimals as jest.Mock).mockResolvedValueOnce(
      mockAnimalResultsMultiplePages,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);

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
                initialIsLoading: true,
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

    expect(mockDispatch.mock.calls.length).toBe(2);
  });

  it('next page button dispatches setCurrentPage properly', async () => {
    (apiService.getAnimals as jest.Mock).mockResolvedValueOnce(
      mockAnimalResultsMultiplePages,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);

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

    const dispatchedAction = mockDispatch.mock.calls[2][0];
    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.animalsPagination.currentPage).toBe(
      mockSearchParams.animalsPagination.currentPage + 1,
    );
  });

  it('next page button does not dispatch setCurrentPage if isLoading is true', async () => {
    (apiService.getAnimals as jest.Mock).mockResolvedValueOnce(
      mockAnimalResultsMultiplePages,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);

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
                initialIsLoading: true,
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

    expect(mockDispatch.mock.calls.length).toBe(2);
  });
});
