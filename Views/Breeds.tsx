import React, {useEffect, useState} from 'react';
import {FlatList, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Breed from '../models/Breed';
import apiService from '../services/apiService';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petTypeName: string};
};

type BreedsScreenRouteProp = RouteProp<RootStackParamList, 'Breeds'>;

type Props = {
  route: BreedsScreenRouteProp;
};

const Breeds: React.FC<Props> = ({route}) => {
  const [typeBreeds, setTypeBreeds] = useState<Breed[]>([]);
  const {petTypeName} = route.params;
  const typeName = petTypeName.toLowerCase();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTypeBreedsData = async () => {
      try {
        const breedsData = await apiService.getPetBreeds(typeName);
        setTypeBreeds(breedsData);
      } catch (error) {
        console.error('Failed top fetch Breeds data: ', error);
      }
    };
    fetchTypeBreedsData();
  }, []);

  const handleBreedSelection = (breed: Breed) => {
    console.log('Navigate with: ', breed.name);
    navigation.navigate('Animals', {breed: breed});
  };

  const renderItem = ({item}: {item: Breed}) => (
    <TouchableOpacity onPress={() => handleBreedSelection(item)}>
      <View style={styles.item}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Select your {typeName} breed, to learn more!
      </Text>
      <FlatList
        data={typeBreeds}
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

export default Breeds;
