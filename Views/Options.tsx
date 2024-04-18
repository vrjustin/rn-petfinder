import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import {
  selectSearchParameters,
  setLocationZip,
} from '../reducers/searchParamsReducer';

const Options: React.FC = () => {
  const dispatch = useDispatch();
  const searchParameters = useSelector(selectSearchParameters);
  const {zipCode} = searchParameters.location;

  const handleZipCodeChange = (newZip: string) => {
    dispatch(
      setLocationZip({...searchParameters, location: {zipCode: newZip}}),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter ZIP Code:</Text>
      <TextInput
        style={styles.input}
        value={zipCode}
        onChangeText={handleZipCodeChange}
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
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default Options;
