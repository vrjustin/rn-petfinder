import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import getAccessToken from './services/apiService';

function App(): React.JSX.Element {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getAccessToken();
      setAccessToken(token);
    };

    fetchAccessToken();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>PetFinder</Text>
        <Text>Access Token: {accessToken}</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
