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
  return (
    <View>
      <Text>This is the Breeds Screen! :: {petTypeName}</Text>
    </View>
  );
};

export default Breeds;
