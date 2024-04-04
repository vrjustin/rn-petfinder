import React from 'react';
import {SafeAreaView} from 'react-native';
import PetTypes from './Views/PetTypes';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <PetTypes />
    </SafeAreaView>
  );
}

export default App;
