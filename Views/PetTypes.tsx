import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import apiService from '../services/apiService';
import {PetType, petTypeImages} from '../models/PetType';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from './Styles/GlobalStyles';

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
      <ImageBackground
        source={petTypeImages[item.name]}
        style={styles.itemBackground}
        imageStyle={styles.imageStyle}>
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
    </TouchableOpacity>
  );

  if (petTypes.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={GlobalStyles.container}>
      <Text style={styles.header}>Select an Animal Type to Get Started:</Text>
      <FlatList
        data={petTypes}
        renderItem={renderPetType}
        keyExtractor={item => item.name}
        numColumns={2} // Display in two columns
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
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
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
});

export default PetTypes;
