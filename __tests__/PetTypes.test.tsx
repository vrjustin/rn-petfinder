import React from 'react';
import {Provider} from 'react-redux';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import {waitFor, render, fireEvent} from '@testing-library/react-native';
import {
  mockPetTypeDog,
  mockPetTypeCat,
  mockPetTypeRabbit,
  mockPetTypeSmallAndFurry,
  mockPetTypeHorse,
  mockPetTypeScalesFinsAndOthers,
  mockPetTypeBarnyard,
  mockPetTypeBird,
  mockPetTypeFavorites,
  selectedAnimalMock,
} from '../__mocks__/mocks';
import {Routes} from '../navigation/Routes';
import apiService from '../services/apiService';
import * as animalsReducer from '../reducers/animalsReducer';
import * as petTypesReducer from '../reducers/petTypesReducer';
import PetTypes from '../Views/PetTypes';

const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    setOptions: mockSetOptions,
  }),
}));

jest.mock('../services/apiService', () => ({
  getPetTypes: jest.fn(),
}));

let renderedPetTypesTree: any;

describe('PetTypes', () => {
  it('renders correctly when no petTypes local and is loading', () => {
    (apiService.getPetTypes as jest.Mock).mockResolvedValueOnce({
      types: [
        mockPetTypeDog,
        mockPetTypeCat,
        mockPetTypeBird,
        mockPetTypeRabbit,
        mockPetTypeSmallAndFurry,
        mockPetTypeHorse,
        mockPetTypeScalesFinsAndOthers,
        mockPetTypeBarnyard,
      ],
    });

    renderedPetTypesTree = renderer.create(
      <Provider store={store}>
        <PetTypes />
      </Provider>,
    );
    expect(renderedPetTypesTree.toJSON()).toMatchSnapshot();
  });

  it('renders correctly when petTypes are fetched', async () => {
    (apiService.getPetTypes as jest.Mock).mockResolvedValueOnce({
      types: [mockPetTypeDog, mockPetTypeCat, mockPetTypeBird],
    });

    await act(async () => {
      renderedPetTypesTree = renderer.create(
        <Provider store={store}>
          <PetTypes />
        </Provider>,
      );
    });
    expect(renderedPetTypesTree.toJSON()).toMatchSnapshot();
  });

  it('navigates to options screen on press of options button', async () => {
    (apiService.getPetTypes as jest.Mock).mockResolvedValueOnce({
      types: [mockPetTypeDog, mockPetTypeCat, mockPetTypeBird],
    });

    render(
      <Provider store={store}>
        <PetTypes />
      </Provider>,
    );

    await waitFor(() => expect(mockSetOptions).toHaveBeenCalled());

    //This will manually call the render function for the headerRight
    //of react navigation. this was the only way to get this to work.
    const headerRight = mockSetOptions.mock.calls[0][0].headerRight;
    const {getByTestId: getByTestIdHeader} = render(headerRight());

    const optionsButton = getByTestIdHeader('PetTypes-UserOptionsButton');
    fireEvent.press(optionsButton);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.Options, {
      from: 'petTypes',
    });
  });

  it('navigates to Breeds screen on press of an animalType', async () => {
    (apiService.getPetTypes as jest.Mock).mockResolvedValueOnce({
      types: [mockPetTypeDog, mockPetTypeCat, mockPetTypeBird],
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <PetTypes />
      </Provider>,
    );
    await waitFor(() => ({}));

    const animalTypeButton = getByTestId('PetTypes-PetType-Dog-button');
    fireEvent.press(animalTypeButton);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.Breeds, {
      petType: mockPetTypeDog,
    });
  });

  it('navigates to Animals screen in favorites mode', async () => {
    jest
      .spyOn(animalsReducer, 'selectFavorites')
      .mockReturnValue([selectedAnimalMock]);
    jest
      .spyOn(petTypesReducer, 'selectPetTypes')
      .mockReturnValue([mockPetTypeDog]);

    const {getByTestId} = render(
      <Provider store={store}>
        <PetTypes />
      </Provider>,
    );
    await waitFor(() => ({}));

    const favoritesButton = getByTestId('PetTypes-Favorites-Button');
    fireEvent.press(favoritesButton);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.Animals, {
      petType: mockPetTypeFavorites,
    });
  });

  it('navigates to Organizations Screen on press of Orgs button', async () => {
    jest
      .spyOn(petTypesReducer, 'selectPetTypes')
      .mockReturnValue([mockPetTypeDog]);

    const {getByTestId} = render(
      <Provider store={store}>
        <PetTypes />
      </Provider>,
    );

    const orgsButton = getByTestId('PetTypes-OrganizationsButton');
    fireEvent.press(orgsButton);
    expect(mockNavigate).toHaveBeenCalledWith(Routes.Organizations);
  });

  it('handles error when getPetTypes fails', async () => {
    (apiService.getPetTypes as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Mocked Error');
    });
    console.error = jest.fn();

    await act(async () => {
      renderedPetTypesTree = renderer.create(
        <Provider store={store}>
          <PetTypes />
        </Provider>,
      );
    });

    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch pet types:',
      expect.any(Error),
    );
  });
});
