import React from 'react';
import {Provider} from 'react-redux';
import * as reactRedux from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import AnimalDetails from '../Views/AnimalDetails';
import {Routes} from '../navigation/Routes';
import {selectedAnimalMock} from '../__mocks__/mocks';
import SearchParameters from '../models/SearchParameters';
import * as searchParamsReducer from '../reducers/searchParamsReducer';
import * as profileReducer from '../reducers/profileReducer';
import * as animalsReducer from '../reducers/animalsReducer';
import Profile from '../models/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    setOptions: mockSetOptions,
  }),
}));

const mockSearchParameters: SearchParameters = {
  location: {
    zipCode: '90210',
  },
  distance: 5,
  tagsPreferred: ['Friendly'],
  breedsPreferred: [],
  orgsPagination: {
    currentPage: 1,
    totalPages: 1,
  },
  animalsPagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

const mockProfile: Profile = {
  shouldOnboard: false,
  isRehydrated: true,
  userName: 'Test-User',
  signInMethod: 'google',
};

let renderedAnimalDetailsTree: any;

describe('AnimalDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    await act(async () => {
      renderedAnimalDetailsTree = renderer.create(
        <Provider store={store}>
          <AnimalDetails
            route={{
              key: 'mockKey',
              name: 'Animal',
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

  it('navigates to contact screen on press of contact details button', async () => {
    render(
      <Provider store={store}>
        <AnimalDetails
          route={{
            key: 'mockKey',
            name: 'Animal',
            params: {
              selectedAnimal: selectedAnimalMock,
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

    const contactDetailsButton = getByTestIdHeader(
      'AnimalDetails-ContactOptionsButton',
    );
    fireEvent.press(contactDetailsButton);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.Contact, {
      selectedAnimal: selectedAnimalMock,
    });
  });

  it('adds the tag to the tagsPreferred searchParameters', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    const {getByTestId} = render(
      <Provider store={store}>
        <AnimalDetails
          route={{
            key: 'mockKey',
            name: 'Animal',
            params: {
              selectedAnimal: selectedAnimalMock,
            },
          }}
        />
      </Provider>,
    );

    const friendlyTag = getByTestId(`AnimalDetailsTag-Friendly`);

    fireEvent.press(friendlyTag);

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.tagsPreferred).toEqual([
      selectedAnimalMock.tags[0],
    ]);
  });

  it('removes the tag from the tagsPreferred searchParameters', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParameters);

    const {getByTestId} = render(
      <Provider store={store}>
        <AnimalDetails
          route={{
            key: 'mockKey',
            name: 'Animal',
            params: {
              selectedAnimal: selectedAnimalMock,
            },
          }}
        />
      </Provider>,
    );

    const friendlyTag = getByTestId(`AnimalDetailsTag-Friendly`);

    fireEvent.press(friendlyTag);

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.tagsPreferred).toEqual([]);
  });

  it('handles favorite properly for selectedAnimal', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(profileReducer, 'profile').mockReturnValue(mockProfile);
    jest
      .spyOn(animalsReducer, 'selectAnimals')
      .mockReturnValue([selectedAnimalMock]);

    const {getByTestId} = render(
      <Provider store={store}>
        <AnimalDetails
          route={{
            key: 'mockKey',
            name: 'Animal',
            params: {
              selectedAnimal: selectedAnimalMock,
            },
          }}
        />
      </Provider>,
    );
    const favoriteButton = getByTestId(`AnimalDetails-FavoriteButton`);
    fireEvent.press(favoriteButton);

    const dispatchedAction = mockDispatch.mock.calls[0][0];
    expect(dispatchedAction.type).toBe('animals/setAnimals');
    const favoritedAnimalAfterDispatch = dispatchedAction.payload[0];
    expect(favoritedAnimalAfterDispatch.isFavorite).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'animals',
      JSON.stringify(dispatchedAction.payload),
    );
  });

  it('sets the currentImageIndex onPress of gallery item', async () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <AnimalDetails
          route={{
            key: 'mockKey',
            name: 'Animal',
            params: {
              selectedAnimal: selectedAnimalMock,
            },
          }}
        />
      </Provider>,
    );
    const galleryItem1 = getByTestId(`AnimalDetailsGalleryItem-1`);
    const startingStyle = galleryItem1.props.children[0].props.style;
    expect(startingStyle).toStrictEqual({width: 100, height: 100, margin: 5});
    fireEvent.press(galleryItem1);
    const selectedStyle = galleryItem1.props.children[0].props.style;
    expect(selectedStyle).toStrictEqual({
      width: 100,
      height: 100,
      margin: 5,
      borderWidth: 2,
      borderColor: 'red',
    });
  });
});
