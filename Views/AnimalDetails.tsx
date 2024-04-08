import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Breed from '../models/Breed';
import PetType from '../models/PetType';
import Animal from '../models/Animal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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

  const handleFavorite = (animal: Animal) => {
    console.log('Favoriting Animal: ', animal.name);
    // const updatedAnimals = animals.map(a =>
    //   a.id === animal.id ? {...a, isFavorite: true} : a,
    // );
    // setAnimals(updatedAnimals);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: '50%', overflow: 'hidden'}}>
        <ImageBackground
          source={
            photos.length > 0
              ? {uri: photos[0].medium}
              : require('../resources/black-1869685_1280.jpg')
          }
          style={{flex: 1}}>
          <View style={{position: 'absolute', top: 8, right: 8}}>
            <TouchableOpacity onPress={() => handleFavorite(selectedAnimal)}>
              <FontAwesomeIcon
                name={selectedAnimal.isFavorite ? 'heart' : 'heart-o'}
                size={20}
                color={'white'}
                style={{marginRight: 8}}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
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
      <Text style={{fontSize: 16, fontWeight: 'bold'}}>Gallery</Text>
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
