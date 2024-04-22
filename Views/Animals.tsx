import React, {useState, useEffect, useLayoutEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAnimals, selectAnimals} from '../reducers/animalsReducer';
import {selectSearchParameters} from '../reducers/searchParamsReducer';
import Animal from '../models/Animal';
import apiService from '../services/apiService';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {AnimalsProps} from '../types/NavigationTypes';
import GlobalStyles from './Styles/GlobalStyles';

const screenWidth = Dimensions.get('window').width;

const UserOptions = ({onPress}: {onPress: () => void}) => {
  return (
    <>
      <FontAwesomeIcon
        name="gear"
        size={20}
        color="#000"
        style={{marginRight: 20}}
        onPress={onPress}
      />
    </>
  );
};

const Animals: React.FC<AnimalsProps> = ({route}) => {
  const [isGridView, setIsGridView] = useState(true);
  const {petType, selectedBreed} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const animals = useSelector(selectAnimals);
  const searchParameters = useSelector(selectSearchParameters);
  const {location, distance, tagsPreffered} = searchParameters;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const toggleGridView = () => {
    setIsGridView(prevState => !prevState);
  };

  useLayoutEffect(() => {
    const handleOptionsPress = () => {
      console.log('Settings Icon Pressed');
      navigation.navigate('Options');
    };
    navigation.setOptions({
      headerRight: () => <UserOptions onPress={handleOptionsPress} />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchAnimalsData = async () => {
      try {
        const animalsResponse = await apiService.getAnimals(
          petType,
          selectedBreed,
          location.zipCode,
          distance,
          currentPage,
        );
        const {animalsData, pagination} = animalsResponse;
        const filteredAnimals = animalsData.filter(animal =>
          animal.tags.some(tag => tagsPreffered.includes(tag)),
        );
        dispatch(
          setAnimals(
            filteredAnimals.length > 0 ? filteredAnimals : animalsData,
          ),
        );
        setCurrentPage(pagination.current_page);
        setTotalPages(pagination.total_pages);
      } catch (error) {
        console.error('Failed top fetch Breeds data: ', error);
      }
    };
    fetchAnimalsData();
  }, [
    dispatch,
    petType,
    selectedBreed,
    location.zipCode,
    distance,
    tagsPreffered,
    currentPage,
  ]);

  const handleAnimalSelection = (animal: Animal) => {
    navigation.navigate('AnimalDetails', {selectedAnimal: animal});
  };

  const handleFavorite = async (animal: Animal) => {
    console.log('Favoriting Animal: ', animal.name);
    const updatedAnimals = animals.map(a =>
      a.id === animal.id ? {...a, isFavorite: !animal.isFavorite} : a,
    );
    dispatch(setAnimals(updatedAnimals));
    await AsyncStorage.setItem('animals', JSON.stringify(updatedAnimals));
  };

  const noData = () => {
    return (
      <View style={styles.gridItemBackground}>
        <Text>No Data Found...</Text>
      </View>
    );
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
              : require('../resources/black-1869685_1280.jpg')
          }
          style={styles.gridItemBackground}
          imageStyle={styles.gridItemImage}>
          <View style={styles.gridItem}>
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: -68,
              }}>
              <TouchableOpacity onPress={() => handleFavorite(item)}>
                <FontAwesomeIcon
                  name={item.isFavorite ? 'heart' : 'heart-o'}
                  size={20}
                  color={'white'}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <View style={{position: 'absolute', bottom: 4}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.gridTextName}>{item.name},</Text>
                <Text style={styles.gridTextAge}> {item.age}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <FontAwesomeIcon
                  name="globe"
                  size={20}
                  color={'white'}
                  style={styles.icon}
                />
                <Text style={styles.gridTextAge}>
                  {item.contact.address.city},{item.contact.address.state}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const paginationHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: 32,
        }}>
        <TouchableOpacity onPress={prevPage}>
          <FontAwesomeIcon name="caret-left" size={30} style={styles.icon} />
        </TouchableOpacity>
        <Text style={{marginHorizontal: 16}}>
          {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity onPress={nextPage}>
          <FontAwesomeIcon name="caret-right" size={30} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={GlobalStyles.container}>
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
      {totalPages > 1 ? paginationHeader() : <></>}
      {animals.length > 0 ? (
        <>
          {isGridView ? (
            <SafeAreaView style={styles.safeArea}>
              <View style={{margin: 8}}>
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
        </>
      ) : (
        noData()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 8,
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
    borderRadius: 8,
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
  gridTextName: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  gridTextAge: {
    fontSize: 16,
    color: 'white',
  },
  icon: {
    marginRight: 8,
  },
});

export default Animals;
