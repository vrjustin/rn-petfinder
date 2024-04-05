import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Breed from '../models/Breed';
import apiService from '../services/apiService';

type RootStackParamList = {
  PetTypes: undefined;
  Breeds: {petTypeName: string};
};

type BreedsScreenRouteProp = RouteProp<RootStackParamList, 'Breeds'>;
type BreedsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Breeds'
>;
type Props = {
  route: BreedsScreenRouteProp;
  navigation: BreedsScreenNavigationProp;
};

const Breeds: React.FC<Props> = ({route}) => {
  const [typeBreeds, setTypeBreeds] = useState<Breed[]>([]);
  const {petTypeName} = route.params;
  const typeName = petTypeName.toLowerCase();

  useEffect(() => {
    const fetchTypeBreedsData = async () => {
      try {
        const breedsData = await apiService.getPetBreeds(typeName);
        setTypeBreeds(breedsData);
      } catch (error) {
        console.error('Failed top fetch Breeds data: ', error);
      }
    };
    fetchTypeBreedsData();
  }, []);

  const renderItem = ({item}: {item: Breed}) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View>
      <Text>This is the Breeds Screen! :: {typeName}</Text>
      <FlatList
        data={typeBreeds}
        renderItem={renderItem}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

export default Breeds;
