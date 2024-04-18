import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import {
  selectSearchParameters,
  setSearchParameters,
} from '../reducers/searchParamsReducer';

const Options: React.FC = () => {
  const dispatch = useDispatch();
  const searchParameters = useSelector(selectSearchParameters);
  const {distance, location} = searchParameters;

  const handleZipCodeChange = (newZip: string) => {
    dispatch(
      setSearchParameters({...searchParameters, location: {zipCode: newZip}}),
    );
  };

  const handleDistanceChange = (newDistance: string) => {
    dispatch(
      setSearchParameters({
        ...searchParameters,
        distance: parseInt(newDistance, 10),
      }),
    );
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
});

export default Options;
