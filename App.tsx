import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import config from './config';

function App(): React.JSX.Element {
  const {CLIENT_ID, CLIENT_SECRET} = config;
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
