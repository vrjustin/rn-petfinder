import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import ThemeContext from '../../contexts/ThemeContext';

const useTheme = () => useContext(ThemeContext);

const GlobalStyles = () => {
  const isDarkMode = useTheme();

  const container = {
    flex: 1,
    padding: 0,
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const header = {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  };

  const textInput = {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  };

  return StyleSheet.create({
    container,
    header,
    textInput,
  });
};

export default GlobalStyles;
