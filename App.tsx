import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import apiConfig from './apiConfig';

function App(): React.JSX.Element {
  const {CLIENT_ID, CLIENT_SECRET} = apiConfig;
  return (
    <SafeAreaView>
      <View>
        <Text>PetFinder</Text>
        <Text>{CLIENT_ID}</Text>
        <Text>{CLIENT_SECRET}</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
