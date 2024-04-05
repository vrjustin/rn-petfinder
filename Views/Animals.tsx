import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Animal from '../models/Animal';
import Breed from '../models/Breed';
import apiService from '../services/apiService';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petTypeName: string};
  Animals: {selectedBreed: Breed};
};

type AnimalsScreenRouteProp = RouteProp<RootStackParamList, 'Animals'>;

type Props = {
  route: AnimalsScreenRouteProp;
};

const Animals: React.FC<Props> = ({route}) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const {selectedBreed} = route.params;
  const hardCodedType = 'dog';

  useEffect(() => {
    const fetchAnimalsData = async () => {
      try {
        const animalsData = await apiService.getAnimals(
          hardCodedType,
          selectedBreed.name,
        );
        setAnimals(animalsData);
      } catch (error) {
        console.error('Failed top fetch Breeds data: ', error);
      }
    };
    fetchAnimalsData();
  }, [selectedBreed]);

  const renderItem = ({item}: {item: Animal}) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={animals}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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

export default Animals;
