import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
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

const screenWidth = Dimensions.get('window').width;

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

  const gridItem = ({item}: {item: Animal}) => (
    <TouchableOpacity onPress={() => handleAnimalSelection(item)}>
      <View style={styles.gridItemContainer}>
        <ImageBackground
          source={
            item.photos.length > 0
              ? {uri: item.photos[0].medium}
              : require('../resources/dog-listening-big-ear-27392035.jpg')
          }
          style={styles.gridItemBackground}
          imageStyle={styles.gridItemImage}>
          <View style={styles.gridItem}>
            <Text style={styles.text}>
              {item.name} :: {item.id}
            </Text>
          </View>
        </ImageBackground>
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
        <SafeAreaView style={styles.safeArea}>
          <View>
            <FlatList
              data={animals}
              renderItem={gridItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.safeArea}>
          <FlatList
            data={animals}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: 'white',
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
  safeArea: {
    flex: 1,
  },
  gridItemContainer: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    width: (screenWidth - 32) / 2,
  },
  gridItem: {
    flex: 1,
    // backgroundColor: '#f9c2ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin: 4,
  },
  gridItemBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemImage: {
    borderRadius: 8, // Add border radius to round the corners of the image
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
});

export default Animals;
