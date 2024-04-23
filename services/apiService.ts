import axios, {AxiosResponse, AxiosError} from 'axios';
import {PetType} from '../models/PetType';
import Breed from '../models/Breed';
import Animal from '../models/Animal';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PetTypesResponse {
  types: PetType[];
}

export interface AnimalResults {
  animalsData: Animal[];
  pagination: {current_page: number; total_pages: number};
}

let jwt_access_token: string | null = null;

const AUTH_ENDPOINT = 'https://api.petfinder.com/v2/oauth2/token';
const TYPES_ENDPOINT = 'https://api.petfinder.com/v2/types';

const getAccessToken = async (): Promise<string | null> => {
  try {
    const response: AxiosResponse<AccessTokenResponse> = await axios.post(
      AUTH_ENDPOINT,
      {
        grant_type: 'client_credentials',
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
      },
    );

    const {access_token} = response.data;
    jwt_access_token = access_token;
    return access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getPetTypes = async (): Promise<PetTypesResponse> => {
  if (!jwt_access_token) {
    await getAccessToken();
  }

  try {
    const response: AxiosResponse<PetTypesResponse> = await axios.get(
      TYPES_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${jwt_access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get pet types:', error);
    return {types: []};
  }
};

const getPetBreeds = async (type: PetType): Promise<Breed[]> => {
  if (!jwt_access_token) {
    await getAccessToken();
  }
  try {
    const typeName = type.name.toLowerCase();
    const response = await axios.get(
      `https://api.petfinder.com/v2/types/${typeName}/breeds`,
      {
        headers: {
          Authorization: `Bearer ${jwt_access_token}`,
        },
      },
    );

    return response.data.breeds;
  } catch (error) {
    return [];
  }
};

const getAnimals = async (
  type: PetType,
  breeds: Breed[],
  location: string,
  searchDistance: number,
  currentPage: number,
): Promise<AnimalResults> => {
  if (!jwt_access_token) {
    await getAccessToken();
  }
  try {
    const localAnimalsJson = await AsyncStorage.getItem('animals');
    const storedAnimals = localAnimalsJson ? JSON.parse(localAnimalsJson) : [];
    const typeName = type.name.toLowerCase();
    // const breedName = breed.name.toLowerCase();
    const breedNamesString = breeds
      .map(breed => breed.name.toLowerCase())
      .join(',');
    const response = await axios.get(
      `https://api.petfinder.com/v2/animals?type=${typeName}&breed=${breedNamesString}&location=${location}&distance=${searchDistance}&page=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${jwt_access_token}`,
        },
      },
    );
    const {current_page, total_pages} = response.data.pagination;
    const animals = response.data.animals.map((animal: Animal) => {
      const storedAnimal = storedAnimals.find(
        (a: Animal) => a.id === animal.id,
      );
      return {
        ...animal,
        isFavorite: storedAnimal ? storedAnimal.isFavorite : false,
      };
    });
    return {
      animalsData: animals,
      pagination: {current_page: current_page, total_pages: total_pages},
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        await getAccessToken();
        return getAnimals(type, breeds, location, searchDistance, currentPage);
      }
    }
    return {animalsData: [], pagination: {current_page: 1, total_pages: 1}};
  }
};

export default {
  getAccessToken,
  getPetTypes,
  getPetBreeds,
  getAnimals,
};
