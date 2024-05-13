import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {Provider} from 'react-redux';
import store from '../stores/store';
import Organizations from '../Views/Organizations';
import {OrganizationsResultsResponse} from '../services/apiService';
import Organization from '../models/Organization';

const mockOrganization: Organization = {
  id: '1',
  name: 'TestOrgName',
  email: 'testorg@testemail.com',
  phone: '555-555-5555',
  address: {
    address1: '123',
    address2: '456',
    city: 'Beverly Hills',
    state: 'CA',
    postcode: '90210',
    country: 'USA',
  },
  hours: {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  },
  url: 'www.url.com',
  website: 'www.website.com',
  mission_statement: null,
  adoption: {
    policy: null,
    url: null,
  },
  social_media: {
    facebook: null,
    twitter: null,
    youtube: null,
    instagram: null,
    pinterest: null,
  },
  photos: [{small: 'small', medium: 'medium', large: 'large', full: 'full'}],
  distance: 10,
  _links: {
    self: {href: 'href'},
    animals: {href: 'href'},
  },
};

const mockOrganizationsResultsResponse: OrganizationsResultsResponse = {
  organizations: [mockOrganization],
  pagination: {
    count_per_page: 1,
    total_count: 1,
    current_page: 1,
    total_pages: 1,
    _links: {
      next: {href: 'href'},
    },
  },
};

jest.mock('../services/apiService.ts', () => ({
  getOrganizations: jest.fn(() => mockOrganizationsResultsResponse),
}));

let renderedOrganizationsTree: any;

describe('Organizations', () => {
  it('renders correctly', async () => {
    await act(async () => {
      renderedOrganizationsTree = renderer.create(
        <Provider store={store}>
          <Organizations />
        </Provider>,
      );
    });
    expect(renderedOrganizationsTree.toJSON()).toMatchSnapshot();
  });
});
