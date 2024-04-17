import axios from 'axios';
import apiService from '../services/apiService';
import { PetType } from '../models/PetType';

jest.mock('axios');

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('should fetch access token', async () => {
      const mockAccessToken = 'my-mocked-token';
      const mockResponse = {
        data: {access_token: mockAccessToken},
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);
      const accessToken = await apiService.getAccessToken();

      expect(accessToken).toEqual(mockAccessToken);
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.petfinder.com/v2/oauth2/token',
        {
          grant_type: 'client_credentials',
          client_id: process.env.CLIENT_ID!,
          client_secret: process.env.CLIENT_SECRET!,
        },
      );
    });

    it('should return null on error of fetch to getAccessToken', async () => {
      const mockError = new Error('Failed to fetch access token');
      (axios.post as jest.Mock).mockRejectedValue(mockError);

      const accessToken = await apiService.getAccessToken();

      expect(accessToken).toBeNull();
    });
  });

  describe('getPetTypes', () => {
    it('should fetch pet types', async () => {
      const mockAccessToken = 'my-mocked-token';
      const mockTokenResponse = {
        data: {access_token: mockAccessToken},
      };

      (axios.post as jest.Mock).mockResolvedValue(mockTokenResponse);
      await apiService.getAccessToken();

      const mockPetTypes = [
        {id: 1, name: 'Dog'},
        {id: 2, name: 'Cat'},
      ];
      const mockResponse = {data: {types: mockPetTypes}};
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const petTypes = await apiService.getPetTypes();

      expect(petTypes).toEqual({types: mockPetTypes});
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.petfinder.com/v2/types',
        {
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
          },
        },
      );
    });

    it('should handle error when fetching pet types', async () => {
      const mockAccessToken = 'my-mocked-token';
      const mockTokenResponse = {
        data: {access_token: mockAccessToken},
      };

      (axios.post as jest.Mock).mockResolvedValue(mockTokenResponse);
      await apiService.getAccessToken();

      const mockError = new Error('Failed to fetch pet types');
      (axios.get as jest.Mock).mockRejectedValue(mockError);

      const petTypes = await apiService.getPetTypes();

      expect(petTypes).toEqual({types: []});
    });
  });

  describe('getPetBreeds', () => {
    it('should fetch pet breeds', async () => {
      const mockAccessToken = 'my-mocked-token';
      const mockTokenResponse = {
        data: {access_token: mockAccessToken},
      };

      (axios.post as jest.Mock).mockResolvedValue(mockTokenResponse);
      await apiService.getAccessToken();

      const mockType: PetType = {
        name: 'Dog',
        coats: [],
        colors: [],
        genders: [],
        _links: {
          self: {href: ''},
          breeds: {href: ''},
        },
      };
      const mockBreeds = [
        {id: 1, name: 'Bulldog'},
        {id: 2, name: 'Labrador'},
      ];
      const mockResponse = {data: {breeds: mockBreeds}};
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const breeds = await apiService.getPetBreeds(mockType);
      const mockTypeName = mockType.name.toLowerCase();

      expect(breeds).toEqual(mockBreeds);
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.petfinder.com/v2/types/${mockTypeName}/breeds`,
        {
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
          },
        },
      );
    });

    it('should handle error when fetching pet breeds', async () => {
      const mockAccessToken = 'my-mocked-token';
      const mockTokenResponse = {
        data: {access_token: mockAccessToken},
      };

      (axios.post as jest.Mock).mockResolvedValue(mockTokenResponse);
      await apiService.getAccessToken();

      const mockType = 'Dog'; // Mocked type from getPetTypes
      const mockError = new Error('Failed to fetch pet breeds');
      (axios.get as jest.Mock).mockRejectedValue(mockError);

      const breeds = await apiService.getPetBreeds(mockType);

      expect(breeds).toEqual([]);
    });
  });

  describe('getAnimals', () => {
    it('should fetch animals', async () => {
      const mockAccessToken = 'my-mocked-token';
      const mockTokenResponse = {
        data: {access_token: mockAccessToken},
      };

      (axios.post as jest.Mock).mockResolvedValue(mockTokenResponse);
      await apiService.getAccessToken();

      const mockType = 'Dog'; // Mocked type from getPetTypes
      const mockBreed = 'Labrador'; // Mocked breed from getPetBreeds
      const mockAnimals = [
        {id: 1, name: 'Buddy', isFavorite: false},
        {id: 2, name: 'Max', isFavorite: false},
      ];
      const mockResponse = {data: {animals: mockAnimals}};
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const animals = await apiService.getAnimals(mockType, mockBreed);

      expect(animals).toEqual(mockAnimals);
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.petfinder.com/v2/animals?type=${mockType}&breed=${mockBreed}`,
        {
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
          },
        },
      );
    });

    it('should handle error when fetching animals', async () => {
      const mockType = 'Dog'; // Mocked type from getPetTypes
      const mockBreed = 'Labrador'; // Mocked breed from getPetBreeds
      const mockError = new Error('Failed to fetch animals');
      (axios.get as jest.Mock).mockRejectedValue(mockError);

      const animals = await apiService.getAnimals(mockType, mockBreed);

      expect(animals).toEqual([]);
    });
  });
});
