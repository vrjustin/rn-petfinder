import React from 'react';
import {Text, View, FlatList, StyleSheet, Image} from 'react-native';
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
  const {
    id,
    organization_id,
    url,
    age,
    gender,
    size,
    coat,
    name,
    description,
    status,
    photos,
  } = selectedAnimal;

  return (
    <View>
      <Text>Name: {name}</Text>
      <Text>ID: {id}</Text>
      <Text>OrgID: {organization_id}</Text>
      <Text>Gender: {gender}</Text>
      <Text>Size: {size}</Text>
      <Text>Coat: {coat}</Text>
      <Text>Description: {description}</Text>
      <Text>Status: {status}</Text>
      <Text>URL: {url}</Text>
      <Text>Age: {age}</Text>
      <FlatList
        horizontal
        data={photos}
        keyExtractor={(item, index) => `${item.full}_${index}`}
        renderItem={({item}) => (
          <Image style={styles.image} source={{uri: item.full}} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default AnimalDetails;
