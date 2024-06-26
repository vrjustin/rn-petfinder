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
import {useSelector, useDispatch} from 'react-redux';
import {
  setAnimals,
  selectAnimals,
  toggleFavorite,
  selectFavorites,
} from '../reducers/animalsReducer';
import {
  selectSearchParameters,
  setSearchParameters,
} from '../reducers/searchParamsReducer';
import {profile} from '../reducers/profileReducer';
import Animal from '../models/Animal';
import apiService from '../services/apiService';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {AnimalsProps, useTypedNavigation} from '../types/NavigationTypes';
import GlobalStyles from './Styles/GlobalStyles';
import {Routes} from '../navigation/Routes';
import en from '../strings/en.json';

const screenWidth = Dimensions.get('window').width;

const UserOptions = ({onPress}: {onPress: () => void}) => {
  return (
    <>
      <FontAwesomeIcon
        testID="Animals-UserOptionsButton"
        name="gear"
        size={20}
        color="#000"
        style={styles.headerIconStyle}
        onPress={onPress}
      />
    </>
  );
};

const Animals: React.FC<AnimalsProps> = ({route}) => {
  const [isGridView, setIsGridView] = useState(true);
  const {petType, initialIsLoading = false} = route.params;
  const navigation = useTypedNavigation();
  const dispatch = useDispatch();
  const animals = useSelector(selectAnimals);
  const favorites = useSelector(selectFavorites);
  const searchParameters = useSelector(selectSearchParameters);
  const userProfile = useSelector(profile);
  const {location, distance, tagsPreferred, animalsPagination} =
    searchParameters;
  const {currentPage, totalPages} = animalsPagination;
  const [isLoading, setIsLoading] = useState(initialIsLoading);
  const selectedBreeds = searchParameters.breedsPreferred;
  const globalStyles = GlobalStyles();

  const isGuest = () => {
    const {userName, signInMethod} = userProfile;
    return signInMethod === undefined ||
      signInMethod === 'guest' ||
      userName === '' ||
      userName === undefined ||
      userName === null
      ? true
      : false;
  };

  const toggleGridView = () => {
    setIsGridView(prevState => !prevState);
  };

  useLayoutEffect(() => {
    const handleOptionsPress = () => {
      navigation.navigate(Routes.Options, {from: 'Animals'});
    };
    navigation.setOptions({
      headerRight: () => <UserOptions onPress={handleOptionsPress} />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchAnimalsData = async () => {
      try {
        setIsLoading(true);
        const animalsResponse = await apiService.getAnimals(
          petType,
          selectedBreeds,
          location.zipCode,
          distance,
          currentPage,
        );
        const {animalsData, pagination} = animalsResponse;
        const filteredAnimals = animalsData.filter(animal =>
          animal.tags.some(tag => tagsPreferred.includes(tag)),
        );
        dispatch(
          setAnimals(
            filteredAnimals.length > 0 ? filteredAnimals : animalsData,
          ),
        );
        dispatch(
          setSearchParameters({
            ...searchParameters,
            animalsPagination: {
              currentPage: pagination.current_page,
              totalPages: pagination.total_pages,
            },
          }),
        );
      } catch (error) {
        console.error('Failed to fetch Animals data: ', error);
      } finally {
        setIsLoading(initialIsLoading ? true : false);
      }
    };
    if (petType.name === 'Favorite' && favorites.length > 0) {
      //We need to apply our tagFiltering system here.
      const filteredFavorites = favorites.filter(fav =>
        fav.tags.some(t => tagsPreferred.includes(t)),
      );
      dispatch(
        setAnimals(
          filteredFavorites.length > 0 ? filteredFavorites : favorites,
        ),
      );
    } else {
      if (petType.name === 'Favorite') {
        //Navigate back so they can select the AnimalType.
        navigation.goBack();
      } else {
        fetchAnimalsData();
      }
    }
  }, [
    dispatch,
    petType,
    selectedBreeds,
    location.zipCode,
    distance,
    tagsPreferred,
    currentPage,
    favorites,
  ]);
  //linter says it needs navigation but when we do unit tests for Animals
  //never complets..??

  const isFavorite = (animal: Animal): boolean => {
    if (favorites.some(a => a.id === animal.id)) {
      return true;
    }
    return false;
  };

  const handleAnimalSelection = (animal: Animal) => {
    navigation.navigate(Routes.AnimalDetails, {selectedAnimal: animal});
  };

  const handleFavorite = async (animal: Animal) => {
    dispatch(toggleFavorite(animal));
  };

  const noData = () => {
    return (
      <View style={styles.gridItemBackground}>
        <Text>No Data Found...</Text>
      </View>
    );
  };

  const renderItem = ({item}: {item: Animal}) => (
    <TouchableOpacity
      testID={`Animals-AnimalListButton-${item.id}`}
      onPress={() => handleAnimalSelection(item)}>
      <View style={styles.item}>
        <Text style={styles.text}>
          {item.name} :: {item.id}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const gridItem = ({item}: {item: Animal}) => (
    <TouchableOpacity
      testID={`Animals-AnimalButton-${item.id}`}
      onPress={() => handleAnimalSelection(item)}>
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
            {!isGuest() && (
              <View style={styles.gridItemFavorite}>
                <TouchableOpacity
                  testID={`Animals-GridItem-${item.id}-FavoriteButton`}
                  onPress={() => handleFavorite(item)}>
                  <FontAwesomeIcon
                    name={isFavorite(item) ? 'heart' : 'heart-o'}
                    size={20}
                    color={'white'}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.gridItemTextRowContainer}>
              <View style={styles.gridItemTextRow}>
                <Text style={styles.gridTextName}>{item.name},</Text>
                <Text style={styles.gridTextAge}> {item.age}</Text>
              </View>
              <View style={styles.gridItemTextRow}>
                <FontAwesomeIcon
                  name="globe"
                  size={20}
                  color={'white'}
                  style={styles.icon}
                />
                <Text style={styles.gridTextAge}>
                  {item.contact?.address.city},{item.contact?.address.state}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  const prevPage = () => {
    if (isLoading) {
      return;
    }
    const prev = Math.max(currentPage - 1, 1);
    dispatch(
      setSearchParameters({
        ...searchParameters,
        animalsPagination: {
          currentPage: prev,
          totalPages: animalsPagination.totalPages,
        },
      }),
    );
  };

  const nextPage = () => {
    if (isLoading) {
      return;
    }
    const next = Math.min(currentPage + 1, totalPages);
    dispatch(
      setSearchParameters({
        ...searchParameters,
        animalsPagination: {
          currentPage: next,
          totalPages: animalsPagination.totalPages,
        },
      }),
    );
  };

  const paginationHeader = () => {
    return (
      <View style={styles.paginationHeaderContainer}>
        <TouchableOpacity
          testID="AnimalsPagination-PrevButton"
          onPress={prevPage}>
          <FontAwesomeIcon name="caret-left" size={30} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.paginationText}>
          {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity
          testID="AnimalsPagination-NextButton"
          onPress={nextPage}>
          <FontAwesomeIcon name="caret-right" size={30} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };

  const headerText = () => {
    return petType.name === 'Favorite' ? en.MyFavorites : en.AdoptablePets;
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{headerText()}</Text>
        <View style={styles.headerIconContainer}>
          <TouchableOpacity testID="toggleGridButton" onPress={toggleGridView}>
            <FontAwesomeIcon
              name="th"
              size={20}
              color={isGridView ? 'black' : 'gray'}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity testID="toggleListButton" onPress={toggleGridView}>
            <FontAwesomeIcon
              name="list"
              size={20}
              color={!isGridView ? 'black' : 'gray'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {totalPages > 1 && petType.name !== 'Favorite' ? (
        paginationHeader()
      ) : (
        <></>
      )}
      {animals.length > 0 ? (
        <>
          {isGridView ? (
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.gridViewFlatlistContainer}>
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
  headerIconStyle: {
    marginRight: 20,
  },
  paginationHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  paginationText: {
    marginHorizontal: 16,
  },
  flatListContent: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  gridViewFlatlistContainer: {
    margin: 8,
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
  gridItemTextRowContainer: {
    position: 'absolute',
    bottom: 4,
  },
  gridItemTextRow: {
    flexDirection: 'row',
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
  gridItemFavorite: {
    position: 'absolute',
    top: 8,
    right: -68,
  },
});

export default Animals;
