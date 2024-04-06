import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Animal from '../models/Animal';
import Breed from '../models/Breed';
import apiService from '../services/apiService';
import PetType from '../models/PetType';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petType: PetType};
  Animals: {petType: string; selectedBreed: Breed};
};

type AnimalsScreenRouteProp = RouteProp<RootStackParamList, 'Animals'>;

type Props = {
  route: AnimalsScreenRouteProp;
};

const GridView: React.FC<{data: Animal[]}> = ({data}) => (
  <View style={styles.gridContainer}>
    {data.map(animal => (
      <TouchableOpacity
        key={animal.id}
        onPress={() => console.log('Pressed on an animal')}
        style={styles.gridItem}>
        <Text style={styles.text}>
          {animal.name} :: {animal.id}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const Animals: React.FC<Props> = ({route}) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isGridView, setIsGridView] = useState(false);
  const {petType, selectedBreed} = route.params;
  const navigation = useNavigation();

  const toggleGridView = () => {
    setIsGridView(prevState => !prevState);
  };

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
      <View style={styles.headerRow}>
        <Text style={styles.header}>{selectedBreed.name} Pets</Text>
        <View style={styles.headerIconContainer}>
          <TouchableOpacity onPress={toggleGridView}>
            <FontAwesomeIcon
              name="th"
              size={20}
              color={isGridView ? 'black' : 'gray'}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleGridView}>
            <FontAwesomeIcon
              name="list"
              size={20}
              color={!isGridView ? 'black' : 'gray'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isGridView ? (
        <ScrollView>
          <GridView data={animals} />
        </ScrollView>
      ) : (
        <FlatList
          data={animals}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  headerIconContainer: {
    flexDirection: 'row',
  },
  flatListContent: {
    flexGrow: 1,
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
  icon: {
    marginRight: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjust as needed
    paddingHorizontal: 10, // Add some padding
  },
  gridItem: {
    width: '48%', // Two items per row with a small gap
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
  },
});

export default Animals;
