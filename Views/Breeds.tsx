import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {setBreeds, selectPetBreeds} from '../reducers/petBreedsReducer';
import {
  setSearchParameters,
  selectSearchParameters,
} from '../reducers/searchParamsReducer';
import {BreedsProps} from '../types/NavigationTypes';
import Breed from '../models/Breed';
import apiService from '../services/apiService';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from './Styles/GlobalStyles';

const Breeds: React.FC<BreedsProps> = ({route}) => {
  const {petType} = route.params;
  const typeName = petType.name;
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const navigation = useNavigation();
  const searchInputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();
  const searchParameters = useSelector(selectSearchParameters);
  const breedsPreferred = searchParameters.breedsPreferred;
  const typeBreeds = useSelector(selectPetBreeds);

  useLayoutEffect(() => {
    const handleNavigateToAnimals = () => {
      navigation.navigate('Animals', {
        petType: petType,
        selectedBreeds: breedsPreferred,
      });
    };
    const headerRight =
      breedsPreferred.length > 0 ? (
        <FontAwesomeIcon
          onPress={handleNavigateToAnimals}
          name="caret-right"
          size={30}
          color="#000"
          style={styles.icon}
        />
      ) : null;

    navigation.setOptions({
      headerRight: () => headerRight,
    });
  }, [navigation, petType, breedsPreferred]);

  useEffect(() => {
    const fetchTypeBreedsData = async () => {
      try {
        const breedsData = await apiService.getPetBreeds(petType);
        dispatch(setBreeds(breedsData));
      } catch (error) {
        console.error('Failed to fetch Breeds data: ', error);
      }
    };
    fetchTypeBreedsData();
  }, [dispatch, petType]);

  useEffect(() => {
    setFilteredBreeds(
      typeBreeds.filter(breed =>
        breed.name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [searchText, typeBreeds]);

  const handleBreedSelection = (breed: Breed) => {
    const index = breedsPreferred.findIndex(b => b.name === breed.name);
    if (index !== -1) {
      const updatedBreeds = [...breedsPreferred];
      updatedBreeds.splice(index, 1);
      dispatch(
        setSearchParameters({
          ...searchParameters,
          breedsPreferred: updatedBreeds,
        }),
      );
    } else {
      dispatch(
        setSearchParameters({
          ...searchParameters,
          breedsPreferred: [...breedsPreferred, breed],
        }),
      );
    }
  };

  const renderItem = ({item}: {item: Breed}) => (
    <TouchableOpacity onPress={() => handleBreedSelection(item)}>
      <View style={styles.item}>
        <FontAwesomeIcon
          name="paw"
          size={20}
          color={
            breedsPreferred.some(b => b.name === item.name) ? 'red' : '#000'
          }
          style={styles.icon}
        />
        <Text
          style={
            breedsPreferred.some(b => b.name === item.name)
              ? styles.selectedBreedText
              : styles.text
          }>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>
        Select your {typeName} breed, or start typing below to learn more!
      </Text>
      <TextInput
        style={GlobalStyles.textInput}
        placeholder="Start typing to filter breeds..."
        value={searchText}
        onChangeText={setSearchText}
        ref={searchInputRef}
        clearButtonMode="while-editing"
        clearTextOnFocus={true}
      />
      <FlatList
        data={filteredBreeds}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
  },
  selectedBreedText: {
    fontSize: 16,
    color: 'red',
  },
  icon: {
    marginRight: 10,
  },
});

export default Breeds;
