import axios from 'axios';
import apiService from '../services/apiService';

jest.mock('axios');

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
});
