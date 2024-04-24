import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './stores/store';
import ThemeContext from './contexts/ThemeContext';

import MainNavigation from './navigation/MainNavigation';

function App(): React.JSX.Element {
  const [isDarkMode] = useState(false);

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={isDarkMode}>
        <NavigationContainer>
          <MainNavigation />
        </NavigationContainer>
      </ThemeContext.Provider>
    </Provider>
  );
}

export default App;
