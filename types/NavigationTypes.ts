import {RouteProp} from '@react-navigation/native';
import Breed from '../models/Breed';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petTypeName: string};
  Animals: {petType: string; selectedBreed: Breed};
  Animal: {selectedAnimal: Animal};
};

type BreedsScreenRouteProp = RouteProp<RootStackParamList, 'Breeds'>;
type AnimalsScreenRouteProp = RouteProp<RootStackParamList, 'Animals'>;
type AnimalScreenRouteProp = RouteProp<RootStackParamList, 'Animal'>;

export type BreedsProps = {
  route: BreedsScreenRouteProp;
};

export type AnimalsProps = {
  route: AnimalsScreenRouteProp;
};

export type AnimalProps = {
  route: AnimalScreenRouteProp;
};
