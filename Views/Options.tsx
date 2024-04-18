import React from 'react';
import {useSelector} from 'react-redux';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import {selectSearchParameters} from '../reducers/searchParamsReducer';

const Options: React.FC = () => {
  const searchParameters = useSelector(selectSearchParameters);
  const {zipCode} = searchParameters.location;

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={styles.label}>Zip</Text>
      <TextInput style={styles.input} value={zipCode} keyboardType="numeric" />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
  },
});

export default Options;
