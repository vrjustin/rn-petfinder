import React from 'react';
import {Provider} from 'react-redux';
import * as reactRedux from 'react-redux';
import * as petBreedsReducer from '../reducers/petBreedsReducer';
import * as searchParamsReducer from '../reducers/searchParamsReducer';
import store from '../stores/store';
import renderer, {act} from 'react-test-renderer';
import {waitFor, render, fireEvent} from '@testing-library/react-native';
import Breeds from '../Views/Breeds';
import SearchParameters from '../models/SearchParameters';
import {BreedsScreenRouteProp} from '../types/NavigationTypes';
import {mockBreeds, mockPetTypeDog} from '../__mocks__/mocks';
import apiService from '../services/apiService';

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
    const mockSearchParameters: SearchParameters = {
      location: {
        zipCode: '90210',
      },
      distance: 5,
      tagsPreferred: ['Friendly'],
      breedsPreferred: [mockBreeds[0]],
      orgsPagination: {
        currentPage: 1,
        totalPages: 1,
      },
      animalsPagination: {
        currentPage: 1,
        totalPages: 1,
      },
    };
    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParameters);

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
    expect(dispatchedAction.payload.breedsPreferred).toEqual([]);
  });
});
