import Animal from '../models/Animal';
import Breed from '../models/Breed';
import Profile from '../models/Profile';
import {PetType} from '../models/PetType';
import Organization from '../models/Organization';
import {
  AnimalResults,
  OrganizationsResultsResponse,
} from '../services/apiService';

export const signedOutProfile: Profile = {
  isRehydrated: false,
  shouldOnboard: false,
  signInMethod: undefined,
  userName: '',
};

export const googleSignedInProfile: Profile = {
  shouldOnboard: false,
  isRehydrated: true,
  userName: 'google-test-user',
  signInMethod: 'google',
};

export const oktaSignedInProfile: Profile = {
  shouldOnboard: false,
  isRehydrated: true,
  userName: 'okta-test-user',
  signInMethod: 'okta',
};

export const guestSignedInProfile: Profile = {
  shouldOnboard: false,
  isRehydrated: true,
  userName: 'guest',
  signInMethod: 'guest',
}

export const selectedAnimalMock: Animal = {
  id: 1,
  organization_id: 'org1',
  url: 'https://example.com',
  age: 'Young',
  gender: 'Female',
  size: 'Medium',
  coat: 'Short',
  name: 'Fluffy',
  description: 'A fluffy dog',
  status: 'Available',
  attributes: {
    declawed: null,
    house_trained: true,
    shots_current: true,
    spayed_neutered: false,
    special_needs: false,
  },
  breeds: {
    mixed: false,
    primary: 'Poodle',
    secondary: null,
    unknown: false,
  },
  colors: {
    primary: 'White',
    secondary: null,
    tertiary: null,
  },
  contact: {
    address: {
      address1: '123 Main St',
      address2: null,
      city: 'Anytown',
      country: 'USA',
      postcode: '12345',
      state: 'NY',
    },
    email: 'email@example.com',
    phone: '555-123-4567',
  },
  photos: [
    {
      full: 'https://example.com/full0.jpg',
      large: 'https://example.com/large0.jpg',
      medium: 'https://example.com/medium0.jpg',
      small: 'https://example.com/small0.jpg',
    },
    {
      full: 'https://example.com/full1.jpg',
      large: 'https://example.com/large1.jpg',
      medium: 'https://example.com/medium1.jpg',
      small: 'https://example.com/small1.jpg',
    },
  ],
  primary_photo_cropped: {
    full: 'https://example.com/full.jpg',
    large: 'https://example.com/large.jpg',
    medium: 'https://example.com/medium.jpg',
    small: 'https://example.com/small.jpg',
  },
  species: 'Dog',
  tags: ['Friendly', 'Playful'],
  isFavorite: false,
};

export const selectedAnimalMockNoContact: Animal = {
  id: 1,
  organization_id: 'org1',
  url: 'https://example.com',
  age: 'Young',
  gender: 'Female',
  size: 'Medium',
  coat: 'Short',
  name: 'Fluffy',
  description: 'A fluffy dog',
  status: 'Available',
  attributes: {
    declawed: null,
    house_trained: true,
    shots_current: true,
    spayed_neutered: false,
    special_needs: false,
  },
  breeds: {
    mixed: false,
    primary: 'Poodle',
    secondary: null,
    unknown: false,
  },
  colors: {
    primary: 'White',
    secondary: null,
    tertiary: null,
  },
  photos: [
    {
      full: 'https://example.com/full.jpg',
      large: 'https://example.com/large.jpg',
      medium: 'https://example.com/medium.jpg',
      small: 'https://example.com/small.jpg',
    },
  ],
  primary_photo_cropped: {
    full: 'https://example.com/full.jpg',
    large: 'https://example.com/large.jpg',
    medium: 'https://example.com/medium.jpg',
    small: 'https://example.com/small.jpg',
  },
  species: 'Dog',
  tags: ['Friendly', 'Playful'],
  isFavorite: false,
};

export const mockAnimalResults: AnimalResults = {
  animalsData: [selectedAnimalMock],
  pagination: {current_page: 1, total_pages: 1},
};

export const mockAnimalResultsMultiplePages: AnimalResults = {
  animalsData: [selectedAnimalMock],
  pagination: {current_page: 2, total_pages: 3},
};

export const mockPetTypeDog: PetType = {
  displayName: 'Dog',
  name: 'Dog',
  coats: ['Short'],
  colors: ['Brown'],
  genders: ['Male'],
  _links: {
    self: {href: ''},
    breeds: {href: ''},
  },
};

export const mockPetTypeCat: PetType = {
  displayName: 'Cat',
  name: 'Cat',
  coats: ['Long'],
  colors: ['Black'],
  genders: ['Female'],
  _links: {
    self: {href: ''},
    breeds: {href: ''},
  },
};

export const mockPetTypeBird: PetType = {
  displayName: 'Bird',
  name: 'Bird',
  coats: [],
  colors: ['Green'],
  genders: ['Unknown'],
  _links: {
    self: {href: ''},
    breeds: {href: ''},
  },
};

export const mockPetTypeFavorites: PetType = {
  displayName: 'Favorite',
  name: 'Favorite',
  coats: [],
  colors: [],
  genders: [],
  _links: {
    self: {href: ''},
    breeds: {href: ''},
  },
};

export const mockBreeds: Breed[] = [
  {
    name: 'Poodle',
    _links: {
      type: {href: ''},
    },
  },
  {
    name: 'German Shephard Dog',
    _links: {
      type: {href: ''},
    },
  },
];

export const mockOrganization: Organization = {
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

export const mockOrganizationsResultsResponse: OrganizationsResultsResponse = {
  organizations: [mockOrganization],
  pagination: {
    count_per_page: 10,
    total_count: 100,
    current_page: 3,
    total_pages: 5,
    _links: {
      next: {href: 'href'},
    },
  },
};
