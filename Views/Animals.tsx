import React, {useState, useEffect} from 'react';
import {Text, View, FlatList} from 'react-native';
import Animal from '../models/Animal';
import apiService from '../services/apiService';

const Animals: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const hardCodedType = 'dog';
  const hardCodedBreed = 'akita';

  useEffect(() => {
    const fetchAnimalsData = async () => {
      try {
        const animalsData = await apiService.getAnimals(
          hardCodedType,
          hardCodedBreed,
        );
        setAnimals(animalsData);
      } catch (error) {
        console.error('Failed top fetch Breeds data: ', error);
      }
    };
    fetchAnimalsData();
  }, []);

  const renderItem = ({item}: {item: Animal}) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View>
      <FlatList
        data={animals}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Animals;
