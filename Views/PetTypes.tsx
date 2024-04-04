import React, {useEffect, useState} from 'react';
import {Text, View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import apiService from '../services/apiService';
import PetType from '../models/PetType';

const PetTypes: React.FC = () => {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPetTypesData = async () => {
      try {
        const typesData = await apiService.getPetTypes();
        setPetTypes(typesData?.types ?? []);
      } catch (error) {
        console.error('Failed to fetch pet types:', error);
      }
    };

    fetchPetTypesData();
  }, []);

  const handlePetTypeSelection = (petType: PetType) => {
    console.log('Navigate with: ', petType.name);
    navigation.navigate('Breeds');
  };

  const renderItem = ({item}: {item: PetType}) => (
    <TouchableOpacity onPress={() => handlePetTypeSelection(item)}>
      <View style={styles.item}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (petTypes.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select an Animal Type to Get Started:</Text>
      <FlatList
        data={petTypes}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
  },
});

export default PetTypes;
