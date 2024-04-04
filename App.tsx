import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, FlatList} from 'react-native';
import getPetTypes from './services/apiService';
import PetType from './models/PetType';

function App(): React.JSX.Element {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);

  useEffect(() => {
    const fetchPetTypesData = async () => {
      const typesData = await getPetTypes();
      setPetTypes(typesData?.types ?? []);
    };

    fetchPetTypesData();
  }, []);

  const renderItem = ({item}: {item: PetType}) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView>
      <View>
        <Text>Select an Animal Type to Get Started:</Text>
        <FlatList
          data={petTypes}
          renderItem={renderItem}
          keyExtractor={item => item.name}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
