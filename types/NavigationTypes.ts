import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {PetType} from '../models/PetType';
import Animal from '../models/Animal';
import Breed from '../models/Breed';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petType: PetType};
  Animals: {
    petType: PetType;
    selectedBreeds: Breed[];
    initialIsLoading?: boolean;
  };
  Animal: {selectedAnimal: Animal};
  Options: {from: string};
};

export type BreedsScreenRouteProp = RouteProp<RootStackParamList, 'Breeds'>;
export type AnimalsScreenRouteProp = RouteProp<RootStackParamList, 'Animals'>;
export type AnimalScreenRouteProp = RouteProp<RootStackParamList, 'Animal'>;
export type OptionsScreenRouteProp = RouteProp<RootStackParamList, 'Options'>;

export type BreedsProps = {
  route: BreedsScreenRouteProp;
};

export type AnimalsProps = {
  route: AnimalsScreenRouteProp;
};

export type AnimalProps = {
  route: AnimalScreenRouteProp;
};

export type OptionsProps = {
  route: OptionsScreenRouteProp;
};

export type SignInUpProps = {
  initialLoadingProp?: boolean;
};

export type OrganizationsProps = {
  initialLoadingProp?: boolean;
};

export const useTypedNavigation = () =>
  useNavigation<StackNavigationProp<RootStackParamList>>();
