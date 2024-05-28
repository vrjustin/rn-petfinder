import React from 'react';
import {Linking} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import * as reactRedux from 'react-redux';
import store from '../stores/store';
import apiService from '../services/apiService';
import * as organizationsReducer from '../reducers/organizationsReducer';
import * as searchParamsReducer from '../reducers/searchParamsReducer';
import Organizations from '../Views/Organizations';
import {
  mockOrganizationsResultsResponse,
  mockOrganization,
  mockSearchParams,
} from '../__mocks__/mocks';

jest.mock('../services/apiService.ts', () => ({
  getOrganizations: jest.fn(),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

let renderedOrganizationsTree: any;

describe('Organizations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles prevPage properly reducing currentPage by 1 down to min of 1', async () => {
    (apiService.getOrganizations as jest.Mock).mockResolvedValue(
      mockOrganizationsResultsResponse,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);
    const {getByTestId} = render(
      <Provider store={store}>
        <Organizations />
      </Provider>,
    );

    await waitFor(() => ({}));
    const prevButton = getByTestId('Organizations-PrevPage-Button');
    fireEvent.press(prevButton);

    const dispatchedAction = mockDispatch.mock.calls[2][0];
    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.orgsPagination.currentPage).toEqual(5);
  });

  it('handles prevPage properly and does not dispatch if isLoading is true', async () => {
    (apiService.getOrganizations as jest.Mock).mockResolvedValue(
      mockOrganizationsResultsResponse,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);
    const {getByTestId} = render(
      <Provider store={store}>
        <Organizations initialLoadingProp={true} />
      </Provider>,
    );

    await waitFor(() => ({}));
    const prevButton = getByTestId('Organizations-PrevPage-Button');
    fireEvent.press(prevButton);

    expect(mockDispatch.mock.calls.length).toBe(2);
  });

  it('handles nextPage properly increasing currentPage by 1 up to max of total pages', async () => {
    (apiService.getOrganizations as jest.Mock).mockResolvedValue(
      mockOrganizationsResultsResponse,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);
    const {getByTestId} = render(
      <Provider store={store}>
        <Organizations />
      </Provider>,
    );

    await waitFor(() => ({}));
    const prevButton = getByTestId('Organizations-NextPage-Button');
    fireEvent.press(prevButton);

    const dispatchedAction = mockDispatch.mock.calls[2][0];
    expect(dispatchedAction.type).toBe('searchParameters/setSearchParameters');
    expect(dispatchedAction.payload.orgsPagination.currentPage).toEqual(7);
  });

  it('handles nextPage properly and does not dispatch if isLoading is true', async () => {
    (apiService.getOrganizations as jest.Mock).mockResolvedValue(
      mockOrganizationsResultsResponse,
    );
    const mockDispatch = jest.fn();
    jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

    jest
      .spyOn(searchParamsReducer, 'selectSearchParameters')
      .mockReturnValue(mockSearchParams);
    const {getByTestId} = render(
      <Provider store={store}>
        <Organizations initialLoadingProp={true} />
      </Provider>,
    );

    await waitFor(() => ({}));
    const prevButton = getByTestId('Organizations-NextPage-Button');
    fireEvent.press(prevButton);

    expect(mockDispatch.mock.calls.length).toBe(2);
  });

  it('renders correctly', async () => {
    (apiService.getOrganizations as jest.Mock).mockResolvedValue(
      mockOrganizationsResultsResponse,
    );
    await act(async () => {
      renderedOrganizationsTree = renderer.create(
        <Provider store={store}>
          <Organizations />
        </Provider>,
      );
    });
    expect(renderedOrganizationsTree.toJSON()).toMatchSnapshot();
  });

  it('handles error when getOrganizations fails', async () => {
    (apiService.getOrganizations as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Mocked Error');
    });
    console.error = jest.fn();

    await act(async () => {
      renderedOrganizationsTree = renderer.create(
        <Provider store={store}>
          <Organizations />
        </Provider>,
      );
    });

    expect(console.error).toHaveBeenCalledWith(
      'Failed to fetch organizations: ',
      expect.any(Error),
    );
  });

  it('handles touching an organization and calling openUrl on item.url', async () => {
    jest
      .spyOn(organizationsReducer, 'selectOrganizations')
      .mockReturnValue([mockOrganization]);

    const {getByTestId} = render(
      <Provider store={store}>
        <Organizations />
      </Provider>,
    );

    const orgButton = getByTestId(`Organizations-Org-${mockOrganization.id}`);
    fireEvent.press(orgButton);

    const expectedURL = mockOrganization.url;
    await Promise.resolve();
    expect(Linking.openURL).toHaveBeenCalledWith(expectedURL);
  });
});
