import React from 'react';
import {Text, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

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
  const {petTypeName} = route.params;
  const typeName = petTypeName.toLowerCase();

  return (
    <View>
      <Text>This is the Breeds Screen! :: {typeName}</Text>
    </View>
  );
};

export default Breeds;
