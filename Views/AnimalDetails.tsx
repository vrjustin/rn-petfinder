import React, {useState} from 'react';
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
  const {age, name, description, photos, contact, tags} = selectedAnimal;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleFavorite = (animal: Animal) => {
    console.log('Favoriting Animal: ', animal.name);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: '50%', overflow: 'hidden'}}>
        <ImageBackground
          source={
            photos.length > 0
              ? {uri: photos[currentImageIndex].medium}
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
          <View style={{position: 'absolute', bottom: 8, left: 8}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.nameText}>{name}, </Text>
              <Text style={styles.ageText}>{age}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <FontAwesomeIcon
                name="globe"
                size={20}
                color={'white'}
                style={{marginRight: 8}}
              />
              <Text style={styles.ageText}>
                {contact.address.city}, {contact.address.state}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      {description && (
        <>
          <Text style={styles.sectionHeaderText}>Introduction</Text>
          <Text style={{padding: 8, fontSize: 14}}>{description}</Text>
        </>
      )}
      {tags.length > 0 && (
        <>
          <Text style={styles.sectionHeaderText}>Tags</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: 8}}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={{color: 'white'}}>{tag}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      {photos.length > 0 && (
        <>
          <Text style={styles.sectionHeaderText}>Gallery</Text>
          <FlatList
            horizontal
            data={photos}
            keyExtractor={(item, index) => `${item.full}_${index}`}
            renderItem={({item, index}) => (
              <View>
                <TouchableOpacity onPress={() => setCurrentImageIndex(index)}>
                  <Image style={styles.image} source={{uri: item.full}} />
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  nameText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  ageText: {
    fontSize: 16,
    color: 'white',
  },
  sectionHeaderText: {
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: 'gray',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default AnimalDetails;
