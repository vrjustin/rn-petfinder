import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import apiService from '../services/apiService';
import {PetType, petTypeImages} from '../models/PetType';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from './Styles/GlobalStyles';

const screenWidth = Dimensions.get('window').width;

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
    navigation.navigate('Breeds', {petTypeName: petType.name});
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
            <Text style={styles.text}>{item.name}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  if (petTypes.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>
        Select an Animal Type to Get Started:
      </Text>
      <FlatList
        data={petTypes}
        renderItem={renderPetType}
        keyExtractor={item => item.name}
        numColumns={2}
      />
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
