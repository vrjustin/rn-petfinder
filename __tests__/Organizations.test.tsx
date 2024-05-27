import React from 'react';
import {Linking} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import {waitFor, render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import store from '../stores/store';
import apiService from '../services/apiService';
import * as organizationsReducer from '../reducers/organizationsReducer';
import Organizations from '../Views/Organizations';
import {
  mockOrganizationsResultsResponse,
  mockOrganization,
} from '../__mocks__/mocks';

jest.mock('../services/apiService.ts', () => ({
  getOrganizations: jest.fn(),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

let renderedOrganizationsTree: any;

describe('Organizations', () => {
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
