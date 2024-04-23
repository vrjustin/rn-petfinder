import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  selectSearchParameters,
  setSearchParameters,
} from '../reducers/searchParamsReducer';
import Breed from '../models/Breed';

const Options: React.FC = () => {
  const dispatch = useDispatch();
  const searchParameters = useSelector(selectSearchParameters);
  const {distance, location, tagsPreferred, breedsPreferred} = searchParameters;

  const handleZipCodeChange = (newZip: string) => {
    dispatch(
      setSearchParameters({...searchParameters, location: {zipCode: newZip}}),
    );
  };

  const handleDistanceChange = (newDistance: string) => {
    let distanceValue =
      newDistance.trim() !== '' ? parseInt(newDistance, 10) : 1;
    distanceValue = Math.max(1, Math.min(500, distanceValue));
    dispatch(
      setSearchParameters({
        ...searchParameters,
        distance: distanceValue,
      }),
    );
  };

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

  const handleBreedPress = (breed: Breed) => {
    if (breedsPreferred.length <= 1) {
      return;
    }
    console.log('Remove Breed: ', breed.name);
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter ZIP Code:</Text>
      <TextInput
        style={styles.input}
        value={location.zipCode}
        onChangeText={handleZipCodeChange}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Enter Search Distance:</Text>
      <TextInput
        style={styles.input}
        value={distance.toString()}
        onChangeText={handleDistanceChange}
        keyboardType="numeric"
      />
      {breedsPreferred.length > 0 && (
        <>
          <Text style={styles.label}>Preferred Breeds:</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: 8}}>
            {breedsPreferred.map((breed, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleBreedPress(breed)}>
                <View
                  key={index}
                  style={
                    !breedsPreferred.includes(breed)
                      ? styles.tag
                      : styles.activeTag
                  }>
                  <Text style={{color: 'white'}}>{breed.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      {tagsPreferred.length > 0 && (
        <>
          <Text style={styles.label}>Preferred Tags:</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: 8}}>
            {tagsPreferred.map((tag, index) => (
              <TouchableOpacity key={index} onPress={() => handleTagPress(tag)}>
                <View
                  key={index}
                  style={
                    !tagsPreferred.includes(tag) ? styles.tag : styles.activeTag
                  }>
                  <Text style={{color: 'white'}}>{tag}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
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
});

export default Options;
