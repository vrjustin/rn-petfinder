import React from 'react';
import {Provider} from 'react-redux';
import * as reactRedux from 'react-redux';
import * as petBreedsReducer from '../reducers/petBreedsReducer';
import * as searchParamsReducer from '../reducers/searchParamsReducer';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import {waitFor, render, fireEvent} from '@testing-library/react-native';
import Breeds from '../Views/Breeds';
import {BreedsScreenRouteProp} from '../types/NavigationTypes';
import {
  mockBreeds,
  mockPetTypeDog,
  mockSearchParamsWithBreeds,
} from '../__mocks__/mocks';
import apiService from '../services/apiService';
import {Routes} from '../navigation/Routes';

const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    setOptions: mockSetOptions,
  }),
}));

jest.mock('../services/apiService', () => ({
  getPetBreeds: jest.fn(),
}));

let renderedBreedsTree: any;

describe('Breeds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    (apiService.getPetBreeds as jest.Mock).mockResolvedValueOnce(mockBreeds);

    await act(async () => {
      renderedBreedsTree = renderer.create(
        <Provider store={store}>
          <Breeds
            route={{params: {petType: mockPetTypeDog}} as BreedsScreenRouteProp}
          />
        </Provider>,
      );
    });
    expect(renderedBreedsTree.toJSON()).toMatchSnapshot();
  });

  it('handles error correctly when apiService fails', async () => {
    (apiService.getPetBreeds as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Mocked Error');
    });
    console.error = jest.fn();

    await act(async () => {
      renderedBreedsTree = renderer.create(
        <Provider store={store}>
          <Breeds
            route={{params: {petType: mockPetTypeDog}} as BreedsScreenRouteProp}
          />
        </Provider>,
      );
    });

    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch Breeds data: ',
      expect.any(Error),
    );
  });

  it('adds the selected breed to the breedsPreferred array and dispatches into searchParameters', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(petBreedsReducer, 'selectPetBreeds')
      .mockReturnValue([mockBreeds[0]]);

    const {getByTestId} = render(
      <Provider store={store}>
        <Breeds
          route={{params: {petType: mockPetTypeDog}} as BreedsScreenRouteProp}
        />
      </Provider>,
    );

    await waitFor(() => ({}));
    const poodleBreedButton = getByTestId(`Breeds-Breed-Poodle`);
    fireEvent.press(poodleBreedButton);
    const dispatchedAction = mockDispatch.mock.calls[2][0];
    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.breedsPreferred).toEqual([mockBreeds[0]]);
  });

  it('removes the selected breed from the breedsPreferred array and dispatches into searchParameters', async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    jest
      .spyOn(petBreedsReducer, 'selectPetBreeds')
      .mockReturnValue([mockBreeds[0]]);

    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParamsWithBreeds);

    const {getByTestId} = render(
      <Provider store={store}>
        <Breeds
          route={{params: {petType: mockPetTypeDog}} as BreedsScreenRouteProp}
        />
      </Provider>,
    );

    await waitFor(() => ({}));
    const poodleBreedButton = getByTestId('Breeds-Breed-Poodle');
    fireEvent.press(poodleBreedButton);
    const dispatchedAction = mockDispatch.mock.calls[2][0];
    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.breedsPreferred[0].name).toEqual(
      'German Shephard Dog',
    );
  });

  it('navigates to Animals screen upon press of handleNavigateToAnimals', async () => {
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParamsWithBreeds);

    render(
      <Provider store={store}>
        <Breeds
          route={{params: {petType: mockPetTypeDog}} as BreedsScreenRouteProp}
        />
      </Provider>,
    );

    await waitFor(() => expect(mockSetOptions).toHaveBeenCalled());

    const headerRight = mockSetOptions.mock.calls[0][0].headerRight;
    const {getByTestId: getByTestIdHeader} = render(headerRight());
    await waitFor(() => ({}));
    const animalsButton = getByTestIdHeader(
      'Breeds-Navigate-to-Animals-Button',
    );
    fireEvent.press(animalsButton);

    expect(mockNavigate).toHaveBeenCalledWith(Routes.Animals, {
      petType: mockPetTypeDog,
      selectedBreeds: mockSearchParamsWithBreeds.breedsPreferred,
    });
  });
});
