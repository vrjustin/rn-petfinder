import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Animal from '../models/Animal';
import Breed from '../models/Breed';
import apiService from '../services/apiService';
import PetType from '../models/PetType';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petType: PetType};
  Animals: {petType: string; selectedBreed: Breed};
};

type AnimalsScreenRouteProp = RouteProp<RootStackParamList, 'Animals'>;

type Props = {
  route: AnimalsScreenRouteProp;
};

const Animals: React.FC<Props> = ({route}) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const {petType, selectedBreed} = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAnimalsData = async () => {
      try {
        const animalsData = await apiService.getAnimals(
          petType,
          selectedBreed.name,
        );
        setAnimals(animalsData);
      } catch (error) {
        console.error('Failed top fetch Breeds data: ', error);
      }
    };
    fetchAnimalsData();
  }, [petType, selectedBreed]);

  const handleAnimalSelection = (animal: Animal) => {
    console.log('Navigate to Animal Details : passed in is: ', animal);
    navigation.navigate('AnimalDetails', {selectedAnimal: animal});
  };

  const renderItem = ({item}: {item: Animal}) => (
    <TouchableOpacity onPress={() => handleAnimalSelection(item)}>
      <View style={styles.item}>
        <Text style={styles.text}>
          {item.name} :: {item.id}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{selectedBreed.name} Pets</Text>
      <FlatList
        data={animals}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
