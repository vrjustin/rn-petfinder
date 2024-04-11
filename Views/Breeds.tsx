import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BreedsProps} from '../types/NavigationTypes';
import Breed from '../models/Breed';
import apiService from '../services/apiService';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Breeds: React.FC<BreedsProps> = ({route}) => {
  const [typeBreeds, setTypeBreeds] = useState<Breed[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const {petTypeName} = route.params;
  const typeName = petTypeName.toLowerCase();
  const navigation = useNavigation();
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchTypeBreedsData = async () => {
      try {
        const breedsData = await apiService.getPetBreeds(typeName);
        setTypeBreeds(breedsData);
        setFilteredBreeds(breedsData);
      } catch (error) {
        console.error('Failed top fetch Breeds data: ', error);
      }
    };
    fetchTypeBreedsData();
  }, []);

  useEffect(() => {
    setFilteredBreeds(
      typeBreeds.filter(breed =>
        breed.name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [searchText, typeBreeds]);

  const handleBreedSelection = (breed: Breed) => {
    navigation.navigate('Animals', {
      petType: petTypeName,
      selectedBreed: breed,
    });
  };

  const renderItem = ({item}: {item: Breed}) => (
    <TouchableOpacity onPress={() => handleBreedSelection(item)}>
      <View style={styles.item}>
        <FontAwesomeIcon
          name="paw"
          size={20}
          color="#000"
          style={styles.icon}
        />
        <Text style={styles.text}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Select your {typeName} breed, or start typing below to learn more!
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Start typing to filter breeds..."
        value={searchText}
        onChangeText={setSearchText}
        ref={searchInputRef}
        clearButtonMode="while-editing"
        clearTextOnFocus={true}
      />
      <FlatList
        data={filteredBreeds}
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
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default Breeds;
