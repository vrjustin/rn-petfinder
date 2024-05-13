import React, {useEffect, useLayoutEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {setPetTypes, selectPetTypes} from '../reducers/petTypesReducer';
import {selectFavorites} from '../reducers/animalsReducer';
import apiService from '../services/apiService';
import {PetType, petTypeImages} from '../models/PetType';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from './Styles/GlobalStyles';
import {Routes} from '../navigation/Routes';
import en from '../strings/en.json';
import {mapTypeNameToLocaleName} from '../models/PetType';
import {useTypedNavigation} from '../types/NavigationTypes';

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

const PetTypes: React.FC = () => {
  const navigation = useTypedNavigation();
  const dispatch = useDispatch();
  const petTypes = useSelector(selectPetTypes);
  const globalStyles = GlobalStyles();
  const favoriteAnimals = useSelector(selectFavorites);
  const haveFavorites = favoriteAnimals.length > 0;

  useLayoutEffect(() => {
    const handleOptionsPress = () => {
      navigation.navigate(Routes.Options, {from: 'petTypes'});
    };
    navigation.setOptions({
      headerRight: () => <UserOptions onPress={handleOptionsPress} />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchPetTypesData = async () => {
      try {
        const typesData = await apiService.getPetTypes();
        const localeResolvedData: PetType[] =
          typesData?.types?.map(type => ({
            ...type,
            displayName: mapTypeNameToLocaleName(type.name),
          })) ?? [];
        dispatch(setPetTypes(localeResolvedData));
      } catch (error) {
        console.error('Failed to fetch pet types:', error);
      }
    };
    fetchPetTypesData();
  }, [dispatch]);

  const handlePetTypeSelection = (petType: PetType) => {
    navigation.navigate(Routes.Breeds, {petType: petType});
  };

  const handleFavoriteSelectionNavigation = () => {
    const favType: PetType = {
      displayName: '',
      name: 'Favorite',
      coats: [],
      colors: [],
      genders: [],
      _links: {
        self: {href: ''},
        breeds: {href: ''},
      },
    };
    navigation.navigate(Routes.Animals, {petType: favType});
  };

  const handleAdoptionOrgsNavigation = () => {
    console.log('Navigate to New Orgs Screen');
    navigation.navigate(Routes.Organizations);
  };

  const renderPetType = ({item}: {item: PetType}) => (
    <TouchableOpacity onPress={() => handlePetTypeSelection(item)}>
      <View style={styles.gridItemContainer}>
        <ImageBackground
          source={
            petTypeImages[item.name]
              ? petTypeImages[item.name]
              : require('../resources/black-1869685_1280.jpg')
          }
          style={styles.itemBackground}
          imageStyle={styles.gridItemImage}>
          <View style={styles.item}>
            <FontAwesomeIcon
              name="paw"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>{item.displayName}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  const renderAdoptionOrgsTouchable = () => {
    return (
      <TouchableOpacity onPress={handleAdoptionOrgsNavigation}>
        <View
          style={{
            backgroundColor: 'grey',
            height: 38,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 20,
            marginBottom: 8,
            borderRadius: 8,
          }}>
          <FontAwesomeIcon
            name={'building'}
            size={20}
            color={'white'}
            style={styles.icon}
          />
          <Text style={{marginRight: 8, color: 'white'}}>
            {en.AdoptionOrgs}
          </Text>
          <FontAwesomeIcon
            name={'building'}
            size={20}
            color={'white'}
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFavoritesTouchable = () => {
    return haveFavorites ? (
      <TouchableOpacity onPress={handleFavoriteSelectionNavigation}>
        <View
          style={{
            backgroundColor: 'pink',
            height: 38,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 20,
            marginBottom: 8,
            borderRadius: 8,
          }}>
          <FontAwesomeIcon
            name={'heart'}
            size={20}
            color={'white'}
            style={styles.icon}
          />
          <Text style={{marginRight: 8}}>{en.Favorites}</Text>
          <FontAwesomeIcon
            name={'heart'}
            size={20}
            color={'white'}
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>
    ) : null;
  };

  if (petTypes.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.header}>{en.HomeHeader}</Text>
      {renderFavoritesTouchable()}
      {renderAdoptionOrgsTouchable()}
      <View style={styles.gridContainer}>
        <FlatList
          data={petTypes}
          renderItem={renderPetType}
          keyExtractor={item => item.name}
          numColumns={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemBackground: {
    flex: 1,
    margin: 10,
    height: 150,
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 16,
    flex: 1,
  },
  gridContainer: {
    flex: 1,
    alignItems: 'center',
  },
  gridItemContainer: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    width: (screenWidth - 32) / 2,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  gridItemImage: {
    borderRadius: 8,
  },
});

export default PetTypes;
