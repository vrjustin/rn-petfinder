import {RouteProp} from '@react-navigation/native';
import {PetType} from '../models/PetType';
import Animal from '../models/Animal';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petType: PetType};
  Animals: {petType: PetType};
  Animal: {selectedAnimal: Animal};
};

export type BreedsScreenRouteProp = RouteProp<RootStackParamList, 'Breeds'>;
export type AnimalsScreenRouteProp = RouteProp<RootStackParamList, 'Animals'>;
export type AnimalScreenRouteProp = RouteProp<RootStackParamList, 'Animal'>;

export type BreedsProps = {
  route: BreedsScreenRouteProp;
};

export type AnimalsProps = {
  route: AnimalsScreenRouteProp;
};

export type AnimalProps = {
  route: AnimalScreenRouteProp;
};
