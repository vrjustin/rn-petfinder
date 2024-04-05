import React from 'react';
import {Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Breed from '../models/Breed';
import PetType from '../models/PetType';
import Animal from '../models/Animal';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petType: PetType};
  Animals: {petType: string; selectedBreed: Breed};
  Animal: {selectedAnimal: Animal};
};

type AnimalScreenRouteProp = RouteProp<RootStackParamList, 'Animal'>;

type Props = {
  route: AnimalScreenRouteProp;
};

const AnimalDetails: React.FC<Props> = ({route}) => {
  const {selectedAnimal} = route.params;
  const {id, url, gender, size, name, description,} = selectedAnimal;
  return (
    <View>
      <Text>Name: {name}</Text>
      <Text>ID: {id}</Text>
      <Text>Gender: {gender}</Text>
      <Text>Size: {size}</Text>
      <Text>Description: {description}</Text>
      <Text>URL: {url}</Text>
    </View>
  );
};

export default AnimalDetails;
