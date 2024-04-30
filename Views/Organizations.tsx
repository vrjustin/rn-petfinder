import React from 'react';
import {View, Text} from 'react-native';
import GlobalStyles from './Styles/GlobalStyles';

const Organizations = () => {
  const globalStyles = GlobalStyles();

  return (
    <View style={globalStyles.container}>
      <Text>Hello Organizations Screen.</Text>
    </View>
  );
};

export default Organizations;
