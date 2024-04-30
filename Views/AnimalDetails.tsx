import React, {useState, useLayoutEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Animal from '../models/Animal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {AnimalProps} from '../types/NavigationTypes';
import {setAnimals, selectAnimals} from '../reducers/animalsReducer';
import {
  setSearchParameters,
  selectSearchParameters,
} from '../reducers/searchParamsReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Routes} from '../navigation/Routes';
import en from '../strings/en.json';

const AttributeItem: React.FC<{label: string; value: string}> = ({
  label,
  value,
}) => (
  <View style={styles.attributeItem}>
    <Text style={styles.attributeLabel}>{label}</Text>
    <Text style={styles.attributeValue}>{value}</Text>
  </View>
);

const ContactOptions = ({onPress}: {onPress: () => void}) => {
  return (
    <>
      <FontAwesomeIcon
        name="mobile"
        size={20}
        color="#000"
        style={{marginRight: 20}}
        onPress={onPress}
      />
    </>
  );
};

const AnimalDetails: React.FC<AnimalProps> = ({route}) => {
  const {selectedAnimal} = route.params;
  const {age, name, description, photos, contact, tags, attributes} =
    selectedAnimal;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(selectedAnimal.isFavorite);
  const animals = useSelector(selectAnimals);
  const searchParameters = useSelector(selectSearchParameters);
  const {tagsPreferred} = searchParameters;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleTagPress = (tag: string) => {
    if (!tagsPreferred.includes(tag)) {
      dispatch(
        setSearchParameters({
          ...searchParameters,
          tagsPreferred: [...tagsPreferred, tag],
        }),
      );
    } else {
      dispatch(
        setSearchParameters({
          ...searchParameters,
          tagsPreferred: tagsPreferred.filter(t => t !== tag),
        }),
      );
    }
  };

  const handleFavorite = async (animal: Animal) => {
    console.log('Favoriting Animal: ', animal.name);
    const isFavoriteValToggle = !animal.isFavorite;
    const updatedAnimals = animals.map(a =>
      a.id === animal.id ? {...a, isFavorite: isFavoriteValToggle} : a,
    );
    setIsFavorite(isFavoriteValToggle);
    dispatch(setAnimals(updatedAnimals));
    await AsyncStorage.setItem('animals', JSON.stringify(updatedAnimals));
  };

  const renderHero = () => {
    const renderIdCard = () => {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'gray',
            borderRadius: 8,
            padding: 4,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
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
      );
    };

    return (
      <View
        style={{
          height: '50%',
          overflow: 'hidden',
        }}>
        <ImageBackground
          source={
            photos.length > 0
              ? {uri: photos[currentImageIndex].large}
              : require('../resources/black-1869685_1280.jpg')
          }
          style={{flex: 1}}
          resizeMode="contain">
          <View style={{position: 'absolute', top: 8, right: 8}}>
            <TouchableOpacity onPress={() => handleFavorite(selectedAnimal)}>
              <FontAwesomeIcon
                name={isFavorite ? 'heart' : 'heart-o'}
                size={20}
                color={'white'}
                style={{marginRight: 8}}
              />
            </TouchableOpacity>
          </View>
          {renderIdCard()}
        </ImageBackground>
      </View>
    );
  };

  const renderAttributes = () => {
    return (
      <View>
        <Text style={styles.sectionHeaderText}>{en.Attributes}</Text>
        <View style={styles.attributesContainer}>
          <View style={styles.attributes}>
            {attributes.declawed !== null && (
              <AttributeItem
                label="Declawed"
                value={attributes.declawed ? 'Yes' : 'No'}
              />
            )}
            {attributes.house_trained !== null && (
              <AttributeItem
                label="House Trained"
                value={attributes.house_trained ? 'Yes' : 'No'}
              />
            )}
            {attributes.shots_current !== null && (
              <AttributeItem
                label="Shots Current"
                value={attributes.shots_current ? 'Yes' : 'No'}
              />
            )}
            {attributes.spayed_neutered !== null && (
              <AttributeItem
                label="Spayed/Neutered"
                value={attributes.spayed_neutered ? 'Yes' : 'No'}
              />
            )}
            {attributes.special_needs !== null && (
              <AttributeItem
                label="Special Needs"
                value={attributes.special_needs ? 'Yes' : 'No'}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderGallery = () => {
    return (
      <>
        <Text style={styles.sectionHeaderText}>{en.Gallery}</Text>
        <FlatList
          horizontal
          data={photos}
          keyExtractor={(item, index) => `${item.full}_${index}`}
          renderItem={({item, index}) => (
            <View>
              <TouchableOpacity onPress={() => setCurrentImageIndex(index)}>
                <Image
                  style={
                    index === currentImageIndex
                      ? styles.imageSelected
                      : styles.image
                  }
                  source={{uri: item.small}}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </>
    );
  };

  useLayoutEffect(() => {
    const handleContactPress = () => {
      console.log('Contact Info Pressed');
      navigation.navigate(Routes.Contact, {selectedAnimal: selectedAnimal});
    };
    navigation.setOptions({
      headerRight: () => <ContactOptions onPress={handleContactPress} />,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHero()}
      <ScrollView>
        {photos.length > 0 && renderGallery()}
        {description && (
          <>
            <Text style={styles.sectionHeaderText}>{en.Introduction}</Text>
            <Text style={{padding: 8, fontSize: 14}}>{description}</Text>
          </>
        )}
        {renderAttributes()}
        {tags.length > 0 && (
          <>
            <Text style={styles.sectionHeaderText}>{en.Tags}</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: 8}}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTagPress(tag)}>
                  <View
                    key={index}
                    style={
                      !tagsPreferred.includes(tag)
                        ? styles.tag
                        : styles.activeTag
                    }>
                    <Text style={{color: 'white'}}>{tag}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  imageSelected: {
    width: 100,
    height: 100,
    margin: 5,
    borderWidth: 2,
    borderColor: 'red',
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
  activeTag: {
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  attributesContainer: {
    padding: 16,
    paddingRight: 32,
  },
  attributes: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  attributeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  attributeLabel: {
    fontWeight: 'normal',
  },
  attributeValue: {},
});

export default AnimalDetails;
